const expressPort = process.env.PORT || '3000'
require('marko/node-require')
const app = require('./src/app')
app.listen(3000, () => console.log('app started'))

/*
const SocketServer = require('ws').Server
wss = new SocketServer({ server: app })
wss.on('request', (req) => {
  const connection = request.accept(null, request.origin);
  connection.on('message', (message) => {
    console.log('message received', message)
    if ( message.type === 'utf8' ) {
    }
  })
  connection.on('close', (conn) => {
    console.log('websocket closed')
  })
})
wss.on('upgrade', (req) => {
  console.log('upgrading...')
})
*/
