const React = require('react')

class TextScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.callback = props.callback
    this.cancel = props.cancel
  }
  componentDidMount() {
  }
  handleChange(event) {
    this.setState({ number: event.target.value })
  }
  sendSMS() {
    this.callback(this.state.number)
  }
  render() {
    return (<div>
      <div>All set!  Want a copy sent to your phone?  Enter your number below:</div>
      <div className="formWrapper">
        <input type="text" className="phoneNumber" onChange={this.handleChange} />
      </div>
      <button onClick={this.sendSMS}>Send SMS</button>
      <button onClick={this.cancel}>No thanks</button>
    </div>)
  }
}

module.exports = TextScreen
