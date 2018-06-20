const React = require('react')
const StartScreen = require('./StartScreen')
const Countdown = require('./Countdown')
const RecordingScreen = require('./RecordingScreen')
const ProcessingScreen = require('./ProcessingScreen')
const InputMeme = require('./InputMeme')
const TextScreen = require('./TextScreen')
const ResetScreen = require('./ResetScreen')

const axios = require('axios')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: "start",
      gifId: null
    }
    this.config = props.config
    this.connectSocket(props.socket)
    this.begin = this.begin.bind(this)
    this.boundNextPhase = this.nextPhase.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.setupDone = this.setupDone.bind(this)
    this.processMemeText = this.processMemeText.bind(this)
    this.memeTextDone = this.memeTextDone.bind(this)
    this.sendSMS = this.sendSMS.bind(this)
    this.skipSendSMS = this.skipSendSMS.bind(this)
    this.skipMeme = this.skipMeme.bind(this)
    this.errorState = this.errorState.bind(this)
    this.moveFinalGif = this.moveFinalGif.bind(this)
    this.finalGifMoved = this.finalGifMoved.bind(this)

    this.errorState = this.errorState.bind(this)

    this.receiveSocketMessage = this.receiveSocketMessage.bind(this)
    this.receiveSocketError = this.receiveSocketError.bind(this)
    this.sendSocketMessage = this.sendSocketMessage.bind(this)
  }
  componentDidMount() {
  }
  begin() {
    this.nextPhase()
  }
  connectSocket(connection) {
    this.socket = connection
    this.socket.App = this
    this.socket.onerror = this.receiveSocketError
    this.socket.onmessage = this.receiveSocketMessage
  }
  receiveSocketMessage(message) {
    console.log(`socket message received`)
    const messageData = JSON.parse(message.data)
    switch ( messageData.state ) {
      case "recordDone":
        this.App.stopRecording()
        break
      case "setupDone":
        this.App.setupDone()
        break
      case "memeTextDone":
        this.App.memeTextDone()
        break
      case "finalGifMoved":
        // we have a remote upload here; handle some errors
        if ( messateData.status === 'error' ) {
          this.App.errorState()
        } else if ( messageData.status === 'nosms' ) {
          this.App.setState({ mode: "resetScreen", gifId: messageData.gifId })
        } else if ( messageData.status === 'success' ) {
          this.App.setState({ gifId: messageData.gifId })
          this.App.finalGifMoved()
        }
        break
      case "smsSent":
        this.App.smsSent()
        break
    }
  }
  receiveSocketError(error) {
    console.log('socket error')
    console.log(error)
  }
  sendSocketMessage(command, payload) {
    const json = { command, payload }
    this.socket.send(JSON.stringify(json))
  }
  startRecording() {
    console.log('sending socket message')
    this.sendSocketMessage("record")
  }
  stopRecording() {
    console.log('stopping recording phase')
    this.nextPhase()
    this.sendSocketMessage("processPostRecord")
  }
  setupDone() {
    console.log('workspace setup done, awaiting input')
    this.nextPhase()
  }
  processVideo() {
    console.log('processing video')
  }
  processMemeText(text) {
    console.log(`adding text ${text} to meme`)
    this.nextPhase()
    this.sendSocketMessage("memeText", text.toUpperCase())
  }
  memeTextDone() {
    console.log('meme text complete')
    this.moveFinalGif()
  }
  moveFinalGif() {
    console.log('saving final gif')
    this.sendSocketMessage("moveFinalGif")
  }
  finalGifMoved() {
    this.nextPhase()
  }
  sendSMS(number) {
    console.log(`sending sms to ${number}`)
    this.sendSocketMessage("sendSMS", { number, gifId: this.state.gifId })
    this.nextPhase()
  }
  hasSMSSent() {
    let retval = Math.floor(Math.random()*10)
    console.log('checking sms...', retval)
    return retval === 1
  }
  skipSendSMS() {
    this.setState({ mode: "resetScreen" })
  }
  skipMeme() {
    this.nextPhase()
    this.moveFinalGif()
  }
  errorState() {
    console.error("error state encountered")
  }
  nextPhase() {
    switch (this.state.mode) {
      case "start":
        this.setState({ mode: "countdown" })
        break
      case "countdown":
        this.setState({ mode: "recording" })
        break
      case "recording":
        this.setState({ mode: "processing", nextMode: "inputMeme", processingMessage: "Processing video..." })
        this.processVideo()
        break
      case "inputMeme":
        this.setState({ mode: "processing", nextMode: "textScreen", processingMessage: "Processing image..." })
        break
      case "textScreen":
        this.setState({ mode: "processing", nextMode: "resetScreen", processingMessage: "Sending SMS...", processingCheck: this.hasSMSSent })
        break
      case "processing":
        console.log('hey')
        console.log(this.state.nextMode)
        this.setState({ mode: this.state.nextMode })
        break
      case "resetScreen":
        this.setState({ mode: "start" })
        break
    } 
  }
  render() {
    switch (this.state.mode) {
      case "resetScreen":
        return (<ResetScreen ticks={this.config.resetTime} callback={this.boundNextPhase} />)
        break
      case "textScreen":
        return (<TextScreen sendSMS={this.sendSMS} skip={this.skipSendSMS} gifId={this.state.gifId}/>)
        break
      case "inputMeme":
        return (<InputMeme processMemeText={this.processMemeText} skip={this.skipMeme} />)
        break
      case "processing":
        return (<ProcessingScreen message={this.state.processingMessage} />)
        break
      case "recording":
        return (<RecordingScreen recordTime={this.config.recordTime} record={this.startRecording} />)
        break
      case "countdown":
        return (<div>
          <div className="countdown main"><Countdown ticks={this.config.countdownTime} callback={this.boundNextPhase} /></div>
        </div>)
        break
      case "start":
      default:
        return (<StartScreen begin={this.begin}/>)
        break
    }
  }
}

module.exports = App
