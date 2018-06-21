const React = require('react')
const StartScreen = require('./StartScreen')
const Countdown = require('./Countdown')
const RecordingScreen = require('./RecordingScreen')
const ProcessingScreen = require('./ProcessingScreen')
const InputMeme = require('./InputMeme')
const TextScreen = require('./TextScreen')
const ResetScreen = require('./ResetScreen')
const MemeText = require('./MemeText')
const Gif = require('./Gif')

const axios = require('axios')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: "start",
      gifId: null,
      processingQueue: []
    }
    this.config = props.config
    this.connectSocket(props.socket)
    this.begin = this.begin.bind(this)
    this.setupDone = this.setupDone.bind(this)
    this.boundNextPhase = this.nextPhase.bind(this)

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)

    this.processMemeText = this.processMemeText.bind(this)
    this.memeTextDone = this.memeTextDone.bind(this)
    this.sendSMS = this.sendSMS.bind(this)
    this.smsSent = this.smsSent.bind(this)
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
  handleRedButton(event) {
    // only listen to the red button if we're start mode
    if ( this.state.mode === "start" ) {
      this.begin()
    }
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
        if ( messageData.status === 'error' ) {
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
    this.state.processingQueue.push("video")
    this.nextPhase()
    this.sendSocketMessage("processPostRecord")
  }
  setupDone() {
    console.log('workspace setup done, awaiting input')
    this.nextPhase()
  }

  // meme actions
  skipMeme() {
    this.moveFinalGif()
    this.nextPhase()
  }
  processMemeText(text) {
    console.log(`adding text ${text} to meme`)
    this.state.processingQueue.push("meme")
    this.state.memeText = text
    this.nextPhase()
    this.sendSocketMessage("memeText", text.toUpperCase())
  }
  memeTextDone() {
    console.log('meme text complete')
    this.nextPhase()
    this.moveFinalGif()
  }

  // sms actions
  skipSendSMS() {
    this.nextPhase()
  }
  sendSMS(number) {
    console.log(`sending sms to ${number}`)
    const gifUrl = `http://biegel.com/app/redcarpet/rc_${this.state.gifId}.gif`
    this.state.processingQueue.push("sms")
    this.sendSocketMessage("sendSMS", { number, gifUrl })
    this.nextPhase()
  }
  smsSent() {
    this.nextPhase()
  }

  // upload actions
  moveFinalGif() {
    console.log('saving final gif')
    this.state.processingQueue.push("upload")
    this.sendSocketMessage("moveFinalGif")
  }
  finalGifMoved() {
    this.nextPhase()
  }
  errorState() {
    console.error("error state encountered")
  }

  // app phase handler
  nextPhase() {
    switch (this.state.mode) {
      case "start":
        this.setState({ mode: "countdown" })
        break
      case "countdown":
        this.setState({ mode: "recording" })
        break
      case "recording":
        this.setState({ mode: "processing", nextMode: "inputMeme" })
        break
      case "inputMeme":
        this.setState({ mode: "textScreen" })
        break
      case "textScreen":
        this.setState({ mode: "processing", nextMode: "resetScreen"})
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
        return (<ResetScreen ticks={this.config.resetTime} callback={this.boundNextPhase} gifId={this.state.gifId} />)
        break
      case "textScreen":
        return (<div><TextScreen sendSMS={this.sendSMS} skip={this.skipSendSMS}/>
          <div className="memeContainer">
            <MemeText text={this.state.memeText} />
            <Gif />
          </div></div>)
        break
      case "inputMeme":
        return (<InputMeme processMemeText={this.processMemeText} skip={this.skipMeme} />)
        break
      case "processing":
        return (<ProcessingScreen queue={this.state.processingQueue} />)
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
