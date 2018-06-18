const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const template = require('./templates/index.marko')
  template.render({
    app_script: 'public/bundle.js',
    app_styles: 'public/main.css'
  }).then(markup => res.send(markup.getOutput()))
})

router.post('/record', (req, res) => {
  res.send({ status: "ok" })
})

router.post('/create', (req, res) => {
  const body = express.json(req.body)
  console.log(body)
  res.send(body)
})

module.exports = router
