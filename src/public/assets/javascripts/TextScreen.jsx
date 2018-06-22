const React = require('react')
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
    this.queueSMS = props.queueSMS
    this.skip = props.skip
  }
  componentDidMount() {
  }
  handleChange(event) {
    this.setState({ number: event.target.value, validatedNumber: Phone(event.target.value) })
  }
  submit() {
    if ( this.validNumber() ) {
      this.queueSMS(this.state.validatedNumber[0])
    } else {
      this.setState({ numberError: true })
    }
  }
  validNumber() {
    console.log(this.state.validatedNumber)
    return this.state.validatedNumber.length !== 0
  }
  render() {
    return (<div className="textForm">
      <h1>Werk it gurl!</h1>
      <h2>Want a copy sent to your phone?  Enter your number below:</h2>
      <div className="formWrapper">
        <input type="text" className="phoneNumber" onChange={this.handleChange} maxLength="10" />
        <div className="buttonWrapper">
          <button className="send" onClick={this.submit}>Send SMS</button>
          <button className="skip" onClick={this.skip}>No thanks</button>
        </div>
      </div>
      <div className="errorBox">{ this.state.numberError ? "Please enter a valid US number" : "" }</div>
    </div>)
  }
}

module.exports = TextScreen
