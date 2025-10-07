"use server"

import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import { addCar } from './actions';

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');


export default async function fetchNewData() {

    const remoteExecutablePath = "https://github.com/Sparticuz/chromium/releases/download/v141.0.0/chromium-v141.0.0-pack.arm64.tar"; let browser

    const carData = require('../../gumtree-car-data.json')
    const makes = Object.values(carData).map(make => make.name)
    makes.sort((a, b) => b.length - a.length)

    try {
        browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(remoteExecutablePath),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
    } catch (error) {
        console.log(`Error when launchin puppetteer: ${error}`)
    }

    const page = await browser.newPage();
    let allListings = []
    const maxPagesToScrape = 15

    for (let pageNum = 1; pageNum <= maxPagesToScrape; pageNum++) {
        const searchUrl = `https://www.gumtree.com/search?search_category=cars&search_location=uk&page=${pageNum}`

        await page.goto(searchUrl, { waitUntil: "domcontentloaded" })
        //await page.screenshot({ path: "debug.png", fullPage: true });

        await page.waitForSelector("article[data-q='search-result']");

        /*
        // FOR DEBUGGING
        const html = await page.content();
        console.log(html.slice(0, 2000));
        */



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



        for (const listingUrl of listingUrls) {
            try {
                await page.goto(listingUrl, { waitUntil: "domcontentloaded" })
                const listingData = await page.evaluate((makes) => {

                    // Getting description price, date posted and location
                    // ADD IMAGES LATER
                    const description = document.querySelector("[itemprop='description']")?.innerText || null;
                    let priceString = document.querySelector("[data-q='ad-price']")?.innerText || "0";
                    let price = parseInt(priceString.replace(/[^0-9]/g, ''), 10);
                    const location = document.querySelector("[data-q='ad-location']")?.innerText || null;
                    const timePosted = document.querySelector("[data-q='Posted-value']")?.innerText || null;

                    // Getting the year and mileage
                    const properties = document.querySelectorAll('li.css-1y31606-desktop-motors-specs') || null
                    let year, mileage = null

                    if (properties) {
                        properties.forEach(element => {
                            const propertyName = element.querySelector("[data-q='car-attributes-name']").innerText.trim() || null
                            const propertyValue = element.querySelector("[data-q='car-attributes-value']").innerText.trim() || null

                            if (propertyName === 'Year') {
                                year = propertyValue
                            } else if (propertyName === 'Mileage') {
                                mileage = propertyValue
                            }
                        })
                    }

                    // Getting the make and model
                    const breadcrumbs = document.querySelectorAll("li.breadcrumbs-link a.link");
                    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
                    const makeModel = lastBreadcrumb?.innerText?.trim() || null;

                    const getTimestamp = (minutesAgo) => {
                        const now = new Date()
                        now.setMinutes(now.getMinutes() - minutesAgo)
                        return now
                    }

                    const findTimePosted = () => {
                        const number = parseInt(timePosted, 10)
                        const time = timePosted.includes('now') ? getTimestamp(0) :
                            timePosted.includes('second') ? getTimestamp(number / 60) :
                                timePosted.includes('min') ? getTimestamp(number) :
                                    timePosted.includes('hour') ? getTimestamp(number * 60) :
                                        timePosted.includes('day') ? getTimestamp(number * 24 * 60) :
                                            null;

                        return time ? time.toISOString() : null
                    }
                    const timePostedString = findTimePosted()

                    const splitMakeAndModel = () => {
                        const upperCaseInput = makeModel.toUpperCase()

                        for (const make of makes) {
                            if (upperCaseInput.startsWith(make.toUpperCase())) {
                                const model = makeModel.substring(make.length).trim()
                                return { make: make, model: model }

                            }
                        }
                        console.log('Error when splitting make and model')
                        return { make: null, model: null }


                    }
                    const makeModelObject = splitMakeAndModel()


                    // Adding description, etc to the attributes
                    const attributes = {
                        description: description,
                        price: price,
                        location: location,
                        timePosted: timePostedString,
                        make: makeModelObject.make,
                        model: makeModelObject.model,
                        year: parseInt(year, 10),
                        mileage: mileage ? parseInt(mileage.replace(/,/g, ''), 10) : null
                    };


                    return (attributes)
                }, makes)
                allListings.push(listingData)
            } catch (error) {
                console.log(`Error received when scraping: ${error}`)
            }


        }
    }

    /* 
    
    // Debugging

    console.log(`an example of a variable is ${allListings[1].make}`)
    console.log(`There were ${allListings.length} listings.`)
    for (const listing of allListings) {
        console.log(`${listing.make} ${listing.model} which costs ${listing.price} Pounds and was posted at ${listing.timePosted}. Was made in ${listing.year} and has done ${listing.mileage} miles.`)
    }
    */

    await browser.close()


    for (const listing of allListings) {
        addCar(listing.make, listing.model, listing.description, listing.price, new Date(listing.timePosted), listing.location, listing.year, listing.mileage)
    }
}