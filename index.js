'use strict'
require('dotenv').config()
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    helmet = require('helmet'),
    logger = require('morgan'),
    port = process.env.PORT

global.__basedir = __dirname
const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token'],
}

const indexRoutes = require('./src/routes/index.routes')

const main = async () => {
    app.use(logger('dev'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept,  Authorization, x-api-key',
        )
        next()
    })
    app.use(cors(corsOption))
    app.use(helmet())
    app.use('/', indexRoutes)
    app.use('*', (req, res) => res.status(404).send('404 Not Found'))
    app.listen(port, () => console.log(`App listening on port ${port}`))
}

main()
