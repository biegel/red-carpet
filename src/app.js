const path = require('path')
const express = require('express')
const app = express()
const routes = require('./routes')

app.use('/public', express.static(path.resolve(__dirname, '../', 'dist/')))
app.use('/', routes)

module.exports = app
