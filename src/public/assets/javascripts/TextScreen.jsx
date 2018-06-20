const React = require('react')
const Gif = require('./Gif')
const Phone = require('phone')

class TextScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      numberError: false,
      validatedNumber: []
    }
    this.validNumber = this.validNumber.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.sendSMS = props.sendSMS
    this.skip = props.skip
  }
  componentDidMount() {
  }
  handleChange(event) {
    this.setState({ number: event.target.value, validatedNumber: Phone(event.target.value) })
  }
  submit() {
    if ( this.validNumber() ) {
      this.sendSMS(this.state.validatedNumber)
    } else {
      this.setState({ numberError: true })
    }
  }
  validNumber() {
    console.log(this.state.validatedNumber)
    return this.state.validatedNumber.length !== 0
  }
  render() {
    return (<div>
      <div>All set!  Want a copy sent to your phone?  Enter your number below:</div>
      <div className="formWrapper">
        <input type="text" className="phoneNumber" onChange={this.handleChange} />
      </div>
      <button onClick={this.submit}>Send SMS</button>
      <button onClick={this.skip}>No thanks</button>
      <div className="errorBox">{ this.state.numberError ? "Please enter a valid US number" : "" }</div>
      <Gif gifId={this.props.gifId} />
    </div>)
  }
}

module.exports = TextScreen
