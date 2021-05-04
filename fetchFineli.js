const fetch = require('node-fetch')
const fetchAbsolute = require('fetch-absolute')
const fetchApi = fetchAbsolute(fetch)("https://fineli.fi")
const fineliApiIdList = require('./fineliApiIdList')
const Grocery = require('./mongo')
const { count } = require('./mongo')
const { json } = require('express')

/**
 * I got these values based on parameters set at frontend
 * where I tried to find the piece of grocery
 * with the lowest 150 overall values
 * these return 188 
 */

const checkForLowValues = (jsonObject) => {
    if (jsonObject.energyKcal < 186.71900960875053 &&
        jsonObject.fat < 3.34957594950773 &&
        jsonObject.protein < 13.4633922894809 &&
        jsonObject.carbohydrate < 24.5261205170774 &&
        jsonObject.fiber < 1.40907811503731 &&
        jsonObject.sugar < 1.33681051758454 &&
        jsonObject.salt < 831.082691048342) {
        return true
    }
    return false
}

const makeGroceryAndSaveToDb = async (jsonObject) => {

    const lowValues = checkForLowValues(jsonObject)

    const grocery = new Grocery({
        nameFi: jsonObject.name.fi,
        apiId: jsonObject.id,
        energyKcal: jsonObject.energyKcal,
        fat: jsonObject.fat,
        protein: jsonObject.protein,
        carbohydrate: jsonObject.carbohydrate,
        fiber: jsonObject.fiber,
        sugar: jsonObject.sugar,
        salt: jsonObject.salt,
        lowValues: lowValues
    })
    try {
        await grocery.save()
    } catch (error) {
        console.log(error)
    }
}

const fetchData = async () => {
    try {
        let count = await Grocery.collection.count()
        for (let i = count; i < fineliApiIdList.length; i++) {
            let response = await fetchApi(`/fineli/api/v1/foods?q=${fineliApiIdList[i]}`)
            const json = await response.json()

            for (let item of json) {
                await makeGroceryAndSaveToDb(item)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { fetchData }