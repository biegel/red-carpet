const React = require('react')
const ReactDOM = require('react-dom')
const Countdown = require('./Countdown')

class RecordingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recordTime: props.recordTime
    }
    this.callback = props.callback
  }
  componentDidMount() {
    this.startRecording()
  }
  startRecording() {
    // call out to python here
    console.log('python start')
    this.recorder = setTimeout(() => this.stopRecording(), this.state.recordTime * 1000)
  }
  stopRecording() {
    clearTimeout(this.recorder)
    this.callback()
    // call out to ffmpeg here
  }
  render() {
    return (<div>
      <div className="recording">Recording</div>
      <Countdown ticks={this.state.recordTime} />
    </div>)
  }
}

module.exports = RecordingScreen
