import puppeteer from "puppeteer";



export default async function fetchNewData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.gumtree.com/search?search_location=Manchester&search_category=cars&sort=date&distance=100')
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
}