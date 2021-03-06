const fs = require('fs')
const exec = require('child_process').exec
const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: 1337,
})

const Convert = require('./convert.js')
const Twilio = require('./twilio.js')

let existsTimeout
let processing = false

const actionQueue = []

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

const sendMessage = (ws, json) => {
  processing = false
  processActionQueue()
  ws.send(JSON.stringify(json))
}

const receiveMessage = (message, ws) => {
  console.log(`socket message received: ${message}`)
  const json = JSON.parse(message)
  let action
  switch ( json.command ) {
    case "record":
      action = () => recordAction(ws)
      break
    case "processPostRecord":
      action = () => processPostRecordAction(ws)
      break
    case "memeText":
      action = () => processMemeTextAction(ws, json.payload)
      break
    case "moveFinalGif":
      action = () => moveAction(ws)
      break
    case "sendSMS":
      action = () => smsAction(ws, json.payload.number, json.payload.gifUrl)
      break
  }
  actionQueue.push(action)
  processActionQueue()
}

const processActionQueue = () => {
  if ( !processing && actionQueue.length ) {
    processing = true
    const action = actionQueue.shift()
    action.call()
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    receiveMessage(message, ws)
  })
})
