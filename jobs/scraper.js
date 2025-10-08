import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../src/app/api/trigger/route";
import fetchNewData from "../lib/actions/webScraping"; // Import your existing function

export const scrapingJob = client.defineJob({
    id: "gumtree-web-scraper",
    name: "Gumtree Web Scraper",
    version: "1.0.0",
    trigger: cronTrigger({
        cron: "*/30 * * * *", // Runs every 30 minutes
    }),
    run: async (payload, io, ctx) => {
        await io.logger.info("Scraping job triggered by Trigger.dev");

        try {
            await io.runTask(
                "scrape-and-save-cars",
                async () => {
                    await fetchNewData();
                },
                { name: "Scrape Gumtree and Save to NeonDB" }
            );
        } catch (error) {
            await io.logger.error("Scraping job failed", { error: error.message });
            throw error;
        }

        await io.logger.info("Scraping job finished successfully!");
    },
});