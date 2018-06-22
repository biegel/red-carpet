const path = require('path')
const express = require('express')
const app = express()
const axios = require('axios')

app.use('/public', express.static(path.resolve(__dirname, '../', 'dist/')))
app.use('/proxy', (req, res) => {
  axios.get('http://biegel.com/app/redcarpet/gif.count').then((response) => {
    res.send(response.data.toString())
  })
})
app.use('/', (req, res) => {
  const template = require('./templates/poll.marko')
  template.render({
    app_script: 'public/poll-bundle.js',
    app_styles: 'public/poll-main.css'
  }).then(markup => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(markup.getOutput())
  })
})
  

module.exports = app
