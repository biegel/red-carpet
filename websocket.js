const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer((req, res) => {})
server.listen(1337, () => {})

// create the server
wsServer = new WebSocketServer({
  httpServer: server
})

console.log('listening on port 1337')

// WebSocket server
wsServer.on('request', (req) => {
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

