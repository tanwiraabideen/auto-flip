"use client"

// Use a form so we can use formdata instead of tracking state

import { useEffect, useState } from 'react'
import { yearFilters, mileageFilters } from '../data/data'
import { useRouter } from 'next/navigation'
import { createFilter } from '../../../lib/actions/actions'

export default function Filters({ session }) {
    const [isLoading, setIsLoading] = useState(false)

    const [selectedMake, setSelectedMake] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedMileage, setSelectedMileage] = useState(null)
    const [models, setModels] = useState(null)

    const user = session.user

    const router = useRouter()

    const carData = require('../../../gumtree-car-data.json')

    const makesAndModels = Object.keys(carData).map(key => ({
        make: carData[key].name,
        models: carData[key].models
    }))


    const setFilters = async () => {
        setIsLoading(true)

        try {

            // THIS MAY HAVE TO BE Filters not filters
            await createFilter(selectedMake, selectedModel, minPrice, maxPrice, selectedMileage, selectedYear, user.id)
            setIsLoading(false)
        } catch (error) {
            console.log(`Error when uploading filter to prisma: ${error}`)
        }

        router.push('/')
    }


    useEffect(() => {
        function getModels() {
            const found = makesAndModels.find(car => car.make === selectedMake)

            //found ? console.log('Found models') : console.log('Didnt find models')

            return found ? found.models : ['empty array returned']
        }
        setModels(getModels())
    }, [selectedMake])


    const handeMakeAny = () => {
        setSelectedMake(null)
        setSelectedModel(null)
    }

    return (
        <div id="filters-container" className="flex flex-row w-full space-x-5">
            <fieldset className='fieldset'>
                <legend className='fieldset-legend'>Select a make</legend>
                <select defaultValue="Make" className="select">
                    <option disabled={true}>Make</option>
                    <option onClick={() => (handeMakeAny())}>Any</option>
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
                    <option onClick={() => (setSelectedModel(null))}>Any</option>
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
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseInt(e.target.value, 10))}
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
                        min={minPrice}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
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
            <button className="btn rounded-xl" onClick={() => setFilters()}>Set filters</button>

        </div>
    )
}