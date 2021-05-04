const mongoose = require('mongoose')
const passwordFile = require('./passwords')
const password = passwordFile.password

const url =
    `mongodb+srv://ohpo:${password}@cluster0.klyzl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message)
    })

const elintarvikeSchema = new mongoose.Schema({
    nameFi: String,
    apiId: Number,
    energyKcal: Number,
    fat: Number,
    protein: Number,
    carbohydrate: Number,
    fiber: Number,
    sugar: Number,
    salt: Number,
    lowValues: Boolean
})

const Grocery = mongoose.model('Grocery', elintarvikeSchema)
module.exports = Grocery