"use server"

import prisma from '../prisma'

export const addCar = async (make, model, description, price, timePosted, location, year, mileage) => {
    try {
        await prisma.cars.create({
            data: {
                make: make,
                model: model,
                description: description,
                price: price,
                timePosted: timePosted,
                location: location,
                year: year,
                mileage: mileage
            }
        })
    } catch (error) {
        console.log(`Error when adding car to database: ${error}`)
    }
}

export const createFilter = async (make, model, minPrice, maxPrice, mileage, age, userId) => {

    try {
        await prisma.filters.create({
            data: {
                make: make,
                model: model,
                minPrice: minPrice,
                maxPrice: maxPrice,
                mileage: mileage,
                age: age,
                userId: userId
            }
        })
    } catch (error) {
        console.log(`Error in createFilter server action : ${error}`)
    }



}