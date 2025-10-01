"use client"

import { useEffect, useState } from 'react'
import { yearFilters, mileageFilters } from '../data/data'

export default function Filters() {
    const [selectedMake, setSelectedMake] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [minPrice, setMinPrice] = useState(null)
    const [maxPrice, setMaxPrice] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedMileage, setSelectedMileage] = useState(null)
    const [models, setModels] = useState(null)
    const [scrapeUrl, setScrapeUrl] = useState("https://www.gumtree.com/search?search_category=cars&search_location=uk&vehicle_make=any&min_price=0&max_price=any&vehicle_model=any&vehicle_mileage=any&vehicle_registration_year=any")

    const carData = require('../../../gumtree-car-data.json')

    const makesAndModels = Object.keys(carData).map(key => ({
        make: carData[key].name,
        models: carData[key].models
    }))


    useEffect(() => {
        function getModels() {
            const found = makesAndModels.find(car => car.make === selectedMake)

            //found ? console.log('Found models') : console.log('Didnt find models')

            return found ? found.models : ['empty array returned']
        }
        setModels(getModels())
    }, [selectedMake])


    // Use Effect hooks for each filter
    useEffect(() => {
        if (selectedMake) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("vehicle_make", selectedMake.toLowerCase().replace(/\s+/g, "-"))
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [selectedMake])



    useEffect(() => {
        if (selectedModel) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("vehicle_model", selectedModel.toLowerCase().replace(/\s+/g, "-"))
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [selectedModel])

    useEffect(() => {
        if (minPrice) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("min_price", minPrice)
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [minPrice])

    useEffect(() => {
        if (maxPrice) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("max_price", maxPrice)
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [maxPrice])

    useEffect(() => {
        if (selectedYear) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("vehicle_registration_year", selectedYear)
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [selectedYear])

    useEffect(() => {
        if (selectedMileage) {
            const tempUrl = scrapeUrl
            const params = new URLSearchParams(tempUrl.split("?")[1])
            params.set("vehicle_mileage", selectedMileage
            )
            setScrapeUrl(tempUrl.split("?")[0] + "?" + params.toString())
        }
    }, [selectedMileage])

    // TEMP FUNCTION FOR TESTING
    useEffect(() => {
        console.log(scrapeUrl)
    }, [scrapeUrl])

    return (
        <div id="filters-container" className="flex flex-row w-full space-x-5">
            <fieldset className='fieldset'>
                <legend className='fieldset-legend'>Select a make</legend>
                <select defaultValue="Make" className="select">
                    <option disabled={true}>Make</option>
                    <option>Any</option>
                    {makesAndModels.map((make) => (
                        <option onClick={() => (setSelectedMake(make.make))} key={make.make}>{make.make}</option>
                    ))}
                </select>
                <p className="label">Optional</p>
            </fieldset>
            <fieldset className='fieldset'>
                <legend className='fieldset-legend'>Select a model</legend>
                <select defaultValue="" className="select">
                    <option value={""} disabled={true}>Model</option>
                    <option>Any</option>
                    {models ? models.map((model) => (
                        <option onClick={() => (setSelectedModel(model.text))} key={model.text}>{model.text}</option>
                    )) : <option disabled={true}>Model</option>}
                </select>
                <p className="label">Optional</p>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Minimum Price</legend>

                <label className="input input-bordered flex items-center gap-2">
                    £
                    <input
                        type="number"
                        className="grow"
                        placeholder="0"
                        min="0"
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </label>

                <p className="label">Optional</p>
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Maximum Price</legend>

                <label className="input input-bordered flex items-center gap-2">
                    £
                    <input
                        type="number"
                        className="grow"
                        placeholder="Any"
                        min="0"
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </label>

                <p className="label">Optional</p>
            </fieldset>
            <fieldset className='fieldset'>
                <legend className='fieldset-legend'>Select the age</legend>
                <select defaultValue="" className="select">
                    <option value={""} disabled={true}>Age</option>
                    {yearFilters.map((year) => (
                        <option onClick={() => (setSelectedYear(year.urlValue))} key={year.label}>{year.label}</option>))}
                </select>
                <p className="label">Optional</p>
            </fieldset>
            <fieldset className='fieldset'>
                <legend className='fieldset-legend'>Select the mileage</legend>
                <select defaultValue="" className="select">
                    <option value={""} disabled={true}>Mileage</option>
                    {mileageFilters.map((mileage) => (
                        <option onClick={() => (setSelectedMileage(mileage.urlValue))} key={mileage.label}>{mileage.label}</option>))}
                </select>
                <p className="label">Optional</p>
            </fieldset>

        </div>
    )
}