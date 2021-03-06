const React = require('react')
const ReactDOM = require('react-dom')
const Countdown = require('./Countdown')

class RecordingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recordTime: props.recordTime
    }
    this.record = props.record
  }
  stopRecording() {
  }
  componentDidMount() {
    this.recorder = setTimeout(() => this.stopRecording(), this.state.recordTime * 1000)
    this.record()
  }
  render() {
    return (<div>
      <div className="recording">Recording</div>
      <Countdown ticks={this.state.recordTime} />
    </div>)
  }
}

module.exports = RecordingScreen
