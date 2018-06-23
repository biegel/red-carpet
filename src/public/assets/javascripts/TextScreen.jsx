const React = require('react')

class TextScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.skip = props.skip
  }
  componentDidMount() {
    // window.document.getElementById('smsNumberField').focus()
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
      <h2>Do it in heels next time!</h2>
      <h2>Press space to reset</h2>
    </div>)
  }
}

module.exports = TextScreen
