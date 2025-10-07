import { NextResponse } from 'next/server';
import fetchNewData from '../../../../lib/actions/webScraping'; // Path to your scraping function

export async function GET(request) {
    // Getting the secret token from the request headers
    const authHeader = request.headers.get('authorization');

    // Verifying the secret token
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await fetchNewData();
        return NextResponse.json({ success: true, message: "Scraping job started." });
    } catch (error) {
        console.error('Error in cron job:', error);
        return NextResponse.json({ success: false, error: 'Failed to run scraping job' }, { status: 500 });
    }
}