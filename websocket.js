const fs = require('fs')
const exec = require('child_process').exec
const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 1337,
})

const Convert = require('./convert.js')
const Twilio = require('./twilio.js')

let existsTimeout

const recordAction = (ws) => {
  console.log('calling python script')
  exec(`python record.py`, (err, stdout, stderr) => {
    if ( err ) {
      console.error(err)
    } else {
      // wait until the video output file actually exists (might take a sec to process)
      const callback = () => sendMessage(ws, { state: "recordDone" })
      const doesExist = () => {
        clearTimeout(existsTimeout)
        fs.access('./raw/video.h264', (err) => {
          if ( err ) {
            existsTimeout = setTimeout(() => doesExist(), 100)
          } else {
            console.log('recording done and file exists')
            callback()
          }
        })
      }
      doesExist()
    }
  })
}

const sendMessage = (ws, json) => {
  ws.send(JSON.stringify(json))
}

const processPostRecordAction = (ws) => {
  Convert.setupWorkspace(() => {
    sendMessage(ws, { state: "setupDone" })
  })
}

const processMemeTextAction = (ws, text) => {
  Convert.createGifWithText(text, () => {
    sendMessage(ws, { state: "memeTextDone" })
  })
}

const moveAction = (ws) => {
  Convert.moveFinalGif((result) => {
    sendMessage(ws, { state: "finalGifMoved", gifId: result.gifId, status: result.status })
  })
}

const smsAction = (ws, number, gifUrl) => {
  console.log(`sending ${gifUrl} over twilio mms to ${number}`)
  const twilioPromise = Twilio.sendMMS(number, gifUrl)
  twilioPromise.then((message) => {
    console.log(`message id ${message.sid} send`)
    sendMessage(ws, { state: "smsSent" })
  }).done()
}

const processMessage = (message, ws) => {
  console.log(`socket message received: ${message}`)
  const json = JSON.parse(message)
  switch ( json.command ) {
    case "record":
      recordAction(ws)
      break
    case "processPostRecord":
      processPostRecordAction(ws)
      break
    case "memeText":
      processMemeTextAction(ws, json.payload)
      break
    case "moveFinalGif":
      moveAction(ws)
      break
    case "sendSMS":
      smsAction(ws, json.payload.number, json.payload.gifUrl)
      break
  }
}
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    processMessage(message, ws)
  })
})
