"use server"

import { createClient } from "@/utils/supabase/server";

// Later make it a relational database

export const createScrapeUrl = async (filterId) => {
    const supabase = await createClient()

    const baseUrl = "https://www.gumtree.com/search?search_category=cars&search_location=uk"

    const { data, error } = await supabase
        .from('Filters')
        .select('*')
        .eq('id', [filterId])
        .single();

    if (error) {
        console.log(error) // Remove this line 
        throw error
    }

    const urlData = {
        vehicle_make: data.make.toLowerCase(),
        min_price: data.minPrice,
        max_price: data.maxPrice,
        vehicle_model: data.model.toLowerCase(),
        vehicle_mileage: data.mileage,
        vehicle_registration_year: data.year
    }

    const params = new URLSearchParams(Object.entries(urlData))
    const scrapeUrl = `${baseUrl}&${params.toString()}`
    return scrapeUrl
}