'use strict'

const express = require('express')
const Prometheus = require('prom-client')

const app = express()
const port = 3001
const metricsInterval = Prometheus.collectDefaultMetrics()


var response_time_arr = [0.1, 0.3, 1, 1.5, 3, 5]
var path_arr = ['get_user', 'set_user']
var response_code_arr = [200, 200, 200, 200, 500]

const histogram = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'http_request_duration_ms',
    labelNames: ['method', 'route', 'code', 'success'],
    buckets: response_time_arr
});

app.get('/random', (req, res, next) => {
    var responseTime = response_time_arr[Math.floor(Math.random() * response_time_arr.length)]
    var path = path_arr[Math.floor(Math.random() * path_arr.length)]
    var code = response_code_arr[Math.floor(Math.random() * response_code_arr.length)]
    res.status(code).send({ message: responseTime, path: path })
    histogram.labels('get', path, code).observe(responseTime)
})

app.get('/register/:success/:code', (req, res, next) => {
    var responseTime = response_time_arr[Math.floor(Math.random() * response_time_arr.length)]
    var result = {
        route: 'register',
        message: req.params.success,
        code: req.params.code,
        responseTime: responseTime
    }
    res.status(req.params.code).send(result)
    res.data = result
    next()
})

app.get('/login/:success/:code', (req, res, next) => {
    var responseTime = response_time_arr[Math.floor(Math.random() * response_time_arr.length)]
    var result = {
        route: 'login',
        message: req.params.success,
        code: req.params.code,
        responseTime: responseTime
    }
    res.status(req.params.code).send(result)
    res.data = result
    next()
})

app.get('/buy/:success/:code', (req, res, next) => {
    var responseTime = response_time_arr[Math.floor(Math.random() * response_time_arr.length)]
    var result = {
        route: 'buy',
        message: req.params.success,
        code: req.params.code,
        responseTime: responseTime
    }
    res.status(req.params.code).send(result)
    res.data = result
    next()
})

app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType)
    res.end(Prometheus.register.metrics())
})

app.use(function(req, res, next) {
    var data = res.data
    histogram.labels(req.method, data.route, data.code, data.message).observe(res.data.responseTime)
})

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
    clearInterval(metricsInterval)

    server.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        process.exit(0)
    })
})
