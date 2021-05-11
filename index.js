const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
const fineliApiIdList = require('./fineliApiIdList')
const Grocery = require('./mongo')
const { count } = require('./mongo')
const { fetchData } = require('./fetchFineli')
const { calculateValuesResult } = require('./fetchFineli')
const { request } = require('express')
const path = require('path')

/**
 * uncomment fetchData() to populate mongo
 * type $ node index.js to run server
 */

fetchData()

app.get('/', (request, response) => {
    response.send('<h1>Go to /allGroceries to view data (if the database is populated)!</h1>')
})

app.get('/allGroceries', (request, response) => {
    Grocery.find({}).then(groceries => {
        response.json(groceries)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})