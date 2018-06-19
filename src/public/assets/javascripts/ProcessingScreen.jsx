const React = require('react')
const ReactDOM = require('react-dom')

class ProcessingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.message = props.message
  }
  componentDidMount() {
  }
  done() {
    console.log('done')
  }
  render() {
    return (<div className="processing">Processing...</div>)
  }
}

module.exports = ProcessingScreen
