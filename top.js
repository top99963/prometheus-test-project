'use strict'

const express = require('express')
const Prometheus = require('prom-client')
const promBundle = require('express-prom-bundle')

const app = express()
const port = 3001
const metricsInterval = Prometheus.collectDefaultMetrics()
const metricsMiddleware = promBundle({includeMethod: true});

app.use(metricsMiddleware)

app.get('/get_user', (req, res) => {
    res.status(200).send('your fuck')
})

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

