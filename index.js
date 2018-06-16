const app = require('./src/app')
const expressPort = process.env.PORT || '3000'
const env = require('env').env || process.env.NODE_ENV

if ( env === 'development' ) {
  require('marko/node-require')
}

app.listen(3000, () => console.log('app started'))
