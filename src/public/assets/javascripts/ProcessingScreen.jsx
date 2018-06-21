const React = require('react')
const ReactDOM = require('react-dom')

class ProcessingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.timeoutId
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    const currentMessage = this.props.queue[0]
    return (<div className="processing">{currentMessage}</div>)
  }
}

module.exports = ProcessingScreen
