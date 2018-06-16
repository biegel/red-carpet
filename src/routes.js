const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const template = require('./templates/index.marko')
  template.render({}).then(markup => res.send(markup.getOutput()))
})

module.exports = router
