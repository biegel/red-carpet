const exec = require('child_process').exec
const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 1337,
})

const Convert = require('./convert.js')

const recordAction = (ws) => {
  console.log('calling python script')
  exec(`python record.py`, (err, stdout, stderr) => {
    if ( err ) {
      console.error(err)
    } else {
      ws.send('recordDone')
    }
  })
}

const processPostRecordAction = (ws) => {
  Convert.setupWorkspace(() => {
    ws.send("setupDone")
  })
}

const processMessage = (message, ws) => {
  console.log(`socket message received: ${message}`)
  switch ( message ) {
    case "record":
      recordAction(ws)
      break
    case "processPostRecord":
      processPostRecordAction(ws)
      break
  }
}
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    processMessage(message, ws)
  })
})
