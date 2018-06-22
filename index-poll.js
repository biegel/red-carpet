const expressPort = process.env.PORT || '3001'
require('marko/node-require')
const app = require('./src/poll-app')
app.listen(3001, () => console.log('app started'))

