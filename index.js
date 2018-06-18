const expressPort = process.env.PORT || '3000'
const env = require('env').env || process.env.NODE_ENV

if ( env === 'development' ) {
  require('marko/node-require')
}

const app = require('./src/app')

app.listen(3000, () => console.log('app started'))
