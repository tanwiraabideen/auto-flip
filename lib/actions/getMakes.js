"use server"
import puppeteer from "puppeteer";
import fs from "fs/promises";

export async function scrapeMakesAndModels() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    try {
        await page.goto('https://www.gumtree.com/cars', {
            waitUntil: "networkidle2",
            timeout: 30000
        });

        await page.waitForSelector('#select-make', { timeout: 10000 });

        // Extract all makes
        const makes = await page.evaluate(() => {
            const select = document.querySelector('#select-make');
            const options = select.querySelectorAll('option');

            return Array.from(options)
                .map(option => ({
                    value: option.value,
                    text: option.innerText.trim()
                }))
                .filter(item =>
                    item.value &&
                    item.value !== 'INITIAL_VALUE' &&
                    item.text.toLowerCase() !== 'any'
                );
        });

        console.log(`Found ${makes.length} makes. Starting to scrape models...`);

        const makesWithModels = {};

        for (let i = 0; i < makes.length; i++) {
            const make = makes[i];
            console.log(`${i + 1}/${makes.length}: ${make.text}`);

            try {
                // Select the make
                await page.select('#select-make', make.value);

                // Wait for models to update - look for the spinner
                await page.waitForFunction(
                    () => {
                        const spinner = document.querySelector('.icon--spinner');
                        return spinner && spinner.getAttribute('aria-hidden') === 'false';
                    },
                    { timeout: 2000 }
                ).catch(() => { });

                // Wait for spinner to disappear
                await page.waitForFunction(
                    () => {
                        const spinner = document.querySelector('.icon--spinner');
                        return !spinner || spinner.getAttribute('aria-hidden') === 'true';
                    },
                    { timeout: 5000 }
                );

                // Small additional delay using setTimeout instead
                await new Promise(resolve => setTimeout(resolve, 300));

                // Extract models
                const models = await page.evaluate(() => {
                    const modelSelect = document.querySelector('#select-model');
                    if (!modelSelect) return [];

                    const options = modelSelect.querySelectorAll('option');
                    return Array.from(options)
                        .map(option => ({
                            value: option.value,
                            text: option.innerText.trim()
                        }))
                        .filter(item =>
                            item.value &&
                            item.value !== 'INITIAL_VALUE' &&
                            item.text.toLowerCase() !== 'any' &&
                            item.text.toLowerCase() !== 'select model'
                        );
                });

                makesWithModels[make.value] = {
                    name: make.text,
                    models: models.map(m => ({ value: m.value, text: m.text }))
                };

                console.log(`  → Found ${models.length} models`);

            } catch (error) {
                console.error(`Error with ${make.text}:`, error.message);
                makesWithModels[make.value] = {
                    name: make.text,
                    models: []
                };
            }
        }

        // Save to JSON file
        await fs.writeFile(
            'gumtree-car-data.json',
            JSON.stringify(makesWithModels, null, 2)
        );

        console.log('\nScraping complete!');
        console.log(`Saved ${Object.keys(makesWithModels).length} makes to gumtree-car-data.json`);

        await browser.close();
        return makesWithModels;

    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return null;
    }
}