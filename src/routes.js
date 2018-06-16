const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const template = require('./templates/index.marko')
  template.render({
    app_script: 'public/bundle.js',
    app_styles: 'public/main.css'
  }).then(markup => res.send(markup.getOutput()))
})

module.exports = router
