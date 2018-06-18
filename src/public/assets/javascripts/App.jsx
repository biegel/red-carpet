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
      mode: "start"
    }
    this.connectSocket(props.socket)
    this.begin = this.begin.bind(this)
    this.boundNextPhase = this.nextPhase.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.processMemeText = this.processMemeText.bind(this)
    this.sendSMS = this.sendSMS.bind(this)
    this.skipSendSMS = this.skipSendSMS.bind(this)
    this.skipMeme = this.skipMeme.bind(this)

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
    this.socket.onerror = this.receiveSocketError
    this.socket.onmessage = this.receiveSocketMessage
  }
  receiveSocketMessage(message) {
    console.log(message)
  }
  receiveSocketError(error) {
    console.log(error)
  }
  sendSocketMessage(message) {
    this.socket.send(message)
  }
  startRecording() {
    console.log('sending socket message')
    this.sendSocketMessage("record")
  }
  processVideo() {
    console.log('processing video')
  }
  hasGifProcessed() {
    let retval = Math.floor(Math.random()*10)
    console.log('checking gif...', retval)
    return retval === 1
  }
  processMemeText(text) {
    console.log(`adding text ${text} to meme`)
    this.nextPhase()
  }
  hasMemeProcessed() {
    let retval = Math.floor(Math.random()*10)
    console.log('checking meme...', retval)
    return retval === 1
  }
  sendSMS(number) {
    console.log(`sending sms to ${number}`)
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
    this.setState({ mode: "textScreen" })
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
        this.setState({ mode: "processing", nextMode: "inputMeme", processingMessage: "Processing...", processingCheck: this.hasGifProcessed })
        this.processVideo()
        break
      case "inputMeme":
        this.setState({ mode: "processing", nextMode: "textScreen", processingMessage: "Processing...", processingCheck: this.hasMemeProcessed })
        break
      case "textScreen":
        this.setState({ mode: "processing", nextMode: "resetScreen", processingMessage: "Sending SMS...", processingCheck: this.hasSMSSent })
        break
      case "processing":
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
        return (<ResetScreen ticks="10" callback={this.boundNextPhase} />)
        break
      case "textScreen":
        return (<TextScreen callback={this.sendSMS} cancel={this.skipSendSMS} />)
        break
      case "inputMeme":
        return (<InputMeme callback={this.processMemeText} cancel={this.skipMeme} />)
        break
      case "processing":
        return (<ProcessingScreen message={this.state.processingMessage} finishedCheck={this.state.processingCheck} callback={this.boundNextPhase} finishedCheckInterval="50" />)
        break
      case "recording":
        return (<RecordingScreen recordTime="2" record={this.startRecording} />)
        break
      case "countdown":
        return (<div>
          <div className="countdown main"><Countdown ticks="2" callback={this.boundNextPhase} /></div>
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
