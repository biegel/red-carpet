const React = require('react')
const ReactDOM = require('react-dom')

class ProcessingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.timeoutId
    this.prettyMessages = {
      video: "Processing video",
      meme: "Processing image",
      sms: "Sending SMS",
      upload: "Uploading image"
    }
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    const currentMessage = this.prettyMessages[this.props.queue[0]]
    return (<div className="processingScreen">{currentMessage}</div>)
  }
}

module.exports = ProcessingScreen
