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
 * with the lowest 150th overall values
 */

const checkForLowValues = (jsonObject) => {
    if (jsonObject.energyKcal < 227 &&
        jsonObject.fat < 1.2 &&
        jsonObject.protein < 7.4 &&
        jsonObject.carbohydrate < 44 &&
        jsonObject.fiber < 3 &&
        jsonObject.sugar < 1 &&
        jsonObject.salt < 650) {
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