"use server"

import prisma from '../prisma'

export const addCars = async (carData) => {

    try {
        for (const car of carData) {
            car.timeUploadedToDataBase = new Date()
        }
        await prisma.cars.createMany({
            data: carData,
            skipDuplicates: true
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