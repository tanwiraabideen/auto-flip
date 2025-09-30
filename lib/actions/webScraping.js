"use server"

import puppeteer from "puppeteer";

export default async function fetchNewData() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    const page = await browser.newPage();

    await page.goto('https://www.gumtree.com/search?search_location=Manchester&search_category=cars&sort=date&distance=100', { waitUntil: "domcontentloaded" })
    await page.screenshot({ path: "debug.png", fullPage: true });
    const html = await page.content();

    // For testing if bot protection has been initiated
    //console.log(html.slice(0, 2000));


    await page.waitForSelector("article[data-q='search-result']");

    const listingUrls = await page.evaluate(() => {
        const listings = document.querySelectorAll("article[data-q='search-result']");
        const urls = [];

        listings.forEach((listing) => {
            // Find the link element within each listing
            const link = listing.querySelector("a[href*='/p/']");
            if (link) {
                urls.push(link.href);
            }
        });

        return urls;
    });

    let allListings = []

    for (const listingUrl of listingUrls) {
        try {
            await page.goto(listingUrl, { waitUntil: "domcontentloaded" })
            const listingData = await page.evaluate(() => {

                // Extract attributes as an array
                const attributesList = document.querySelectorAll("li.css-1y31606-desktop-motors-specs");
                const attributes = [];

                attributesList.forEach((item) => {
                    const name = item.querySelector("[data-q='car-attributes-name']")?.innerText?.trim();
                    const value = item.querySelector("[data-q='car-attributes-value']")?.innerText?.trim();

                    if (name && value) {
                        attributes.push({ name, value });
                    }
                });

                // Getting description price, date posted and location
                // ADD IMAGES LATER
                const description = document.querySelector("[itemprop='description']")?.innerText || null;
                const price = document.querySelector("[data-q='ad-price']")?.innerText || null;
                const location = document.querySelector("[data-q='ad-location']")?.innerText || null;
                const timePosted = document.querySelector("[data-q='Posted-value']")?.innerText || null;

                // Getting the make and model
                const breadcrumbs = document.querySelectorAll("li.breadcrumbs-link a.link");
                const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
                const makeModel = lastBreadcrumb?.innerText?.trim() || null;


                // Adding description, etc to the attributes
                attributes.push(description, price, location, timePosted, makeModel, listingUrl)

                return (attributes)
            })
            allListings.push(listingData)
        } catch (error) {
            console.log(`Error received when scraping: ${error}`)
        }


    }


    // Debugging purposes
    /*console.log(`Found ${listingUrls.length} URLs, for example, ${listingUrls[1]}`)
    console.log(`Listings are: ${allListings}`)*/

    await browser.close()
}