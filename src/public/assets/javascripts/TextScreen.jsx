const React = require('react')

class TextScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.skip = props.skip
  }
  componentDidMount() {
    window.document.getElementById('smsNumberField').focus()
  }
  handleChange(event) {
    this.props.numberChange(event.target.value)
  }
  render() {
        /*<div className="buttonWrapper">
          <button className="send" onClick={this.submit}>Send SMS</button>
          <button className="skip" onClick={this.skip}>No thanks</button>
        </div>*/
    return (<div className="textForm">
      <h1>Werk it gurl!</h1>
      <h2>Want a copy sent to your phone?  Enter your number below and press ENTER:</h2>
      <div className="formWrapper">
        <input id="smsNumberField" type="text" className="phoneNumber" onChange={this.handleChange} maxLength="10" />
      </div>
      <h2>Or just press space bar to skip</h2>
      <div className="errorBox">{ this.props.numberError ? "Please enter a valid US number" : "" }</div>
    </div>)
  }
}

module.exports = TextScreen
