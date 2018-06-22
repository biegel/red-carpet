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
const Phone = require('phone')

const axios = require('axios')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      countdownCount: 0,
      mode: "start",
      gifId: null,
      smsQueued: false,
      smsNumber: null,
      numberError: false,
      readyForSMS: false,
      processingQueue: []
    }
    this.state = this.initialState
    this.config = props.config
    this.connectSocket(props.socket)
    this.begin = this.begin.bind(this)
    this.setupDone = this.setupDone.bind(this)
    this.boundNextPhase = this.nextPhase.bind(this)

    this.tickCallback = this.tickCallback.bind(this)

    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)

    this.processMemeText = this.processMemeText.bind(this)
    this.memeTextDone = this.memeTextDone.bind(this)
    this.skipMeme = this.skipMeme.bind(this)

    this.queueSMS = this.queueSMS.bind(this)
    this.sendSMS = this.sendSMS.bind(this)
    this.smsSent = this.smsSent.bind(this)
    this.skipSendSMS = this.skipSendSMS.bind(this)

    this.numberChange = this.numberChange.bind(this)

    this.removeItemFromProcessingQueue = this.removeItemFromProcessingQueue.bind(this)

    this.moveFinalGif = this.moveFinalGif.bind(this)
    this.finalGifMoved = this.finalGifMoved.bind(this)

    this.errorState = this.errorState.bind(this)
    this.receiveSocketMessage = this.receiveSocketMessage.bind(this)
    this.receiveSocketError = this.receiveSocketError.bind(this)
    this.sendSocketMessage = this.sendSocketMessage.bind(this)
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    if ( this.state.mode === "finalProcessing" && this.state.processingQueue.length === 0 ) {
      console.log('leaving end stage processing mode')
      this.nextPhase()
    }
  }
  begin() {
    this.nextPhase()
  }
  handleSpacePress(event) {
    // only listen to the red button if we're start mode
    if ( this.state.mode === "start" ) {
      this.begin()
    } else if ( this.state.mode === "textScreen" ) {
      console.log('space: skipping sms')
      this.skipSendSMS()
    }
  }
  handleEnterPress(event) {
    if ( this.state.mode === "textScreen" ) {
      this.validateNumber()
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
    if ( this.App.state.mode === "recording" && messageData.state === "recordDone" ) {
      this.App.stopRecording()
    } else if ( this.App.state.mode === "blockingProcessing" && messageData.state === "setupDone" ) {
      this.App.setupDone()
    } else if ( this.App.state.mode === "textScreen" || this.App.state.mode === "finalProcessing" ) {
      if ( messageData.state === "memeTextDone" ) {
        this.App.memeTextDone()
      } else if ( messageData.state === "finalGifMoved" ) {
        // we have a remote upload here; handle some errors
        if ( messageData.status === 'error' ) {
          this.App.errorState()
        } else if ( messageData.status === 'success' ) {
          this.App.setState({ gifId: messageData.gifId })
          this.App.finalGifMoved()
        }
      } else if ( messageData.state === "smsSent" ) {
        this.App.smsSent()
      }
    } else {
      console.log('discarding socket message')
      console.log(message)
    }
  }
  receiveSocketError(error) {
    console.log('socket error')
    console.log(error)
    this.errorState()
  }
  sendSocketMessage(command, payload) {
    const json = { command, payload }
    this.socket.send(JSON.stringify(json))
  }
  addItemToProcessingQueue(item) {
    this.setState({
      processingQueue: this.state.processingQueue.concat([item])
    })
  }
  removeItemFromProcessingQueue(item) {
    const tempArr = [...this.state.processingQueue]
    const index = tempArr.indexOf(item)
    tempArr.splice(index, 1)
    this.setState({ processingQueue: tempArr })
  }
  startRecording() {
    console.log('sending socket message')
    this.sendSocketMessage("record")
  }
  stopRecording() {
    console.log('stopping recording phase')
    this.addItemToProcessingQueue("video")
    this.nextPhase()
    this.sendSocketMessage("processPostRecord")
  }
  setupDone() {
    console.log('workspace setup done, awaiting input')
    this.removeItemFromProcessingQueue("video")
    this.processMemeText()
    this.nextPhase()
  }

  // meme actions
  skipMeme() {
  }
  processMemeText() {
    const memes = [
      "yaaas bitch werk",
      "yaaas kween",
      "werq",
      "red carpet disco",
      "beat drop",
      "i can't even",
      "i have lost the ability to even",
      "can't be bothered",
      "fierceness",
      "got it at target",
      "got it at walmart",
      "durnk",
      "call me",
      "fuck trump",
      "entrance made",
      "lip sync for your life",
      "5 drinks in"
    ]
    const text = window.shuffle(memes).pop().toUpperCase()
    console.log(`adding text ${text} to meme`)
    this.addItemToProcessingQueue("meme")
    this.setState({ memeText: text })
    this.sendSocketMessage("memeText", text.toUpperCase())
  }
  memeTextDone() {
    console.log('meme text complete')
    this.moveFinalGif()
    this.removeItemFromProcessingQueue("meme")
  }

  // sms actions
  skipSendSMS() {
    this.nextPhase()
  }
  numberChange(number) {
    this.setState({
      smsNumber: number
    })
  }
  validateNumber() {
    console.log(`validating number ${this.state.smsNumber}`)
    const validatedNumber = Phone(this.state.smsNumber)
    if ( validatedNumber.length !== 0 ) {
      console.log('number valid!')
      this.queueSMS(validatedNumber[0])
    } else {
      console.log('number invalid!')
      this.setState({ numberError: true })
    }
  }
  queueSMS() {
    console.log(`queuing sms to ${this.state.smsNumber}`)
    this.setState({ smsQueued: true })
    console.log('smsQueued', this.state.smsQueued)
    if ( this.state.readyForSMS ) {
      console.log('ready now for SMS, sending...')
      this.sendSMS()
    }
    this.nextPhase()
  }
  sendSMS() {
    console.log(`sending sms to ${this.state.smsNumber}`)
    const gifUrl = `http://biegel.com/app/redcarpet/rc_${this.state.gifId}.gif`
    const number = this.state.smsNumber
    this.addItemToProcessingQueue("sms")
    this.sendSocketMessage("sendSMS", { number, gifUrl })
  }
  smsSent() {
    console.log('sms sent!')
    this.removeItemFromProcessingQueue("sms")
  }

  // upload actions
  moveFinalGif() {
    console.log('saving final gif')
    this.addItemToProcessingQueue("upload")
    this.sendSocketMessage("moveFinalGif")
  }
  finalGifMoved() {
    console.log('final gif saved')
    this.removeItemFromProcessingQueue("upload")
    this.setState({ readyForSMS: true })
    console.log('smsQueued', this.state.smsQueued)
    if ( this.state.smsQueued ) {
      console.log('sms is already queued, sending now...')
      this.sendSMS()
      this.nextPhase()
    }
  }
  errorState() {
    console.error("error state encountered")
  }

  tickCallback(count) {
    if ( this.state.mode === "countdown" ) {
      this.setState({ countdownCount: count })
    }
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
        this.setState({ mode: "blockingProcessing" })
        break
      case "textScreen":
        this.setState({ mode: "finalProcessing" })
        break
      case "blockingProcessing":
        this.setState({ mode: "textScreen" })
        break
      case "finalProcessing":
        this.setState({ mode: "resetScreen" })
        break
      case "resetScreen":
        this.setState(this.initialState)
        break
    } 
  }
  render() {
    switch (this.state.mode) {
      case "resetScreen":
        return (<ResetScreen ticks={this.config.resetTime} callback={this.boundNextPhase} />)
        break
      case "textScreen":
        return (<div className="textScreen">
          <TextScreen queueSMS={this.queueSMS} numberError={this.state.numberError} numberChange={this.numberChange} />
          <div className="memeContainer bottom">
            <MemeText text={this.state.memeText} />
            <Gif />
          </div></div>)
        break
      //case "inputMeme":
      //  return (<InputMeme processMemeText={this.processMemeText} skip={this.skipMeme} />)
      //  break
      case "blockingProcessing":
      case "finalProcessing":
        return (<ProcessingScreen queue={this.state.processingQueue} />)
        break
      case "recording":
        return (<RecordingScreen recordTime={this.config.recordTime} record={this.startRecording} />)
        break
      case "countdown":
        const cls = `countdownScreen c${this.state.countdownCount}`
        return (<div className={cls}>
          <h1>Strut your stuff in</h1>
          <Countdown ticks={this.config.countdownTime} callback={this.boundNextPhase} tickCallback={this.tickCallback} />
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
