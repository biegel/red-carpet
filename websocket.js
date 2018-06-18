const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHeader(200, { "Content-Type": "text/html" })
  res.write("")
  res.end()
})
server.listen(1337)

wss = new WebSocketServer({
  httpServer: server
})

server.on('upgrade', wss.handleUpgrade)
console.log('listening on port 1337')


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

