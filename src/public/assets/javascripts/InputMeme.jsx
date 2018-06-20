const React = require('react')
const Gif = require('./Gif')

class InputMeme extends React.Component {
  constructor(props) {
    super(props)
    this.state = { processingMeme: false }
    this.processMemeText = props.processMemeText
    this.skip = props.skip
    this.suggestions = [
      "yaaas bitch werk!",
      "yaaas kween!",
      "red carpet disco",
      "beat drop",
      "i can't even",
      "i have lost the ability to even",
      "can't be bothered",
      "fierceness"
    ]
    this.limit = 50
    this.handleChange = this.handleChange.bind(this)
    this.processText = this.processText.bind(this)
    this.skip = this.skip.bind(this)
    this.cachebust = (new Date()*1).toString()
    this.curSuggestions = window.shuffle(this.suggestions).slice(0,3)
  }
  componentWillUnmount() {
    this.curSuggestions = window.shuffle(this.suggestions).slice(0,3)
  }
  // TODO: write meme text over gif in HTML, then process once at the end
  // this is going to take too long to process on a slow raspberry pi
  handleChange(event) {
    this.setState({ text: event.target.value })
  }
  processText() {
    console.log(`meme text: ${this.state.text}`)
    this.setState({ processingMeme: true })
    this.processMemeText(this.state.text)
  }
  skip() {
    this.skip()
  }
  render() {
    const gifClassName = `gifWrapper ${this.state.processingMeme ? "disabled" : "enabled" }`
    return (<div>
      <div className="instructions">Below is your gif!  Enter some meme text if you want (or skip it).  Some suggestions:</div>
      <ul>{ this.curSuggestions.map((text, index) => {
        const keyname = `sugg${index}`
        return (<li key={keyname}>{text}</li>)
      })}</ul>
      <div className="formWrapper">
        <input type="text" className="memeTextInput" onChange={this.handleChange} disabled={this.state.processingMeme} maxLength="40"/>
      </div>
      <button onClick={this.processText} disabled={this.state.processingMeme}>Submit</button>
      <button onClick={this.skip} disabled={this.state.processingMeme}>Skip</button>
      <div className="memeText">{this.state.text}</div>
      <Gif working="true" />
    </div>)
  }
}

module.exports = InputMeme
