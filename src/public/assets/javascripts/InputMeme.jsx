const React = require('react')

class InputMeme extends React.Component {
  constructor(props) {
    super(props)
    this.processMemeText = props.processMemeText
    this.submit = props.submit
    this.cancel = props.cancel
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
    clearTimeout(this.changeId)
    this.changeId = setTimeout(() => this.processText(), 750)
  }
  processText() {
    console.log(`meme text: ${this.state.text}`)
    this.processMemeText(this.state.text)
  }
  skip() {
    this.cancel()
  }
  render() {
    const gifClassName = `gifWrapper ${this.props.processingMeme ? "disabled" : "enabled" }`
    const gifSource = `/workspace/working.gif?_=${this.props.cachebust}`
    return (<div>
      <div className="instructions">Below is your gif!  Enter some meme text if you want (or skip it).  Some suggestions:</div>
      <ul>{ this.curSuggestions.map((text, index) => {
        const keyname = `sugg${index}`
        return (<li key={keyname}>{text}</li>)
      })}</ul>
      <div className="formWrapper">
        <input type="text" className="memeText" onChange={this.handleChange} disabled={this.props.processingMeme} />
      </div>
      <button onClick={this.processText}>Submit</button>
      <button onClick={this.skip}>Skip</button>
      <div className={gifClassName}><img src={gifSource} /></div>
    </div>)
  }
}

module.exports = InputMeme
