const express = require('express')
const {getShops, getEndpoints} = require('./controllers/controller')

const app = express()
app.use(express.json())


app.get('/api', getEndpoints)

app.get('/api/shops', getShops)


app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' })
})

module.exports = app