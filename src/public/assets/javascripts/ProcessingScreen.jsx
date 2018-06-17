const React = require('react')
const ReactDOM = require('react-dom')

class ProcessingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.finishedCheck = props.finishedCheck
    this.finishedCheckInterval = parseInt(props.finishedCheckInterval, 10)
    this.message = props.message
    this.callback = props.callback
  }
  componentDidMount() {
    this.setCheckTimeout()
  }
  setCheckTimeout() {
    clearTimeout(this.checkId)
    this.checkId = setTimeout(() => {
      if ( this.finishedCheck() ) {
        this.callback()
        this.done()
      } else {
        this.setCheckTimeout()
      }
    }, this.finishedCheckInterval)
  }
  done() {
    console.log('done')
    clearTimeout(this.checkId)
  }
  render() {
    return (<div className="processing">Processing...</div>)
  }
}

module.exports = ProcessingScreen
