// src/app/api/trigger/route.js
import { TriggerClient } from "@trigger.dev/sdk";
import { scrapingJob } from "../../../../jobs/scraper"; // We will create this next

export const client = new TriggerClient({
    id: "autoflip-scraper",
    apiKey: process.env.TRIGGER_API_KEY,
});

// This handler connects all your jobs to Trigger.dev
function handler(req) {
    return http.nextRequestHandler(req, client, {
        jobs: [scrapingJob],
    });
}

export { handler as GET, handler as POST, handler as PUT };