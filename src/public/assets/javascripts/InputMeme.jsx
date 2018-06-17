const React = require('react')

class InputMeme extends React.Component {
  constructor(props) {
    super(props)
    this.sourceGif = props.sourceGif
    this.callback = props.callback
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
  }
  componentDidMount() {
  }
  handleChange(event) {
    console.log('updating gif')
    this.setState({ text: event.target.value })
  }
  processText() {
    console.log(`meme text: ${this.state.text}`)
    this.callback(this.state.text)
  }
  skip() {
    this.cancel()
  }
  render() {
    return (<div>
      <div>(gif here)</div>
      <div className="formWrapper">
        <input type="text" className="memeText" onChange={this.handleChange} />
      </div>
      <button onClick={this.processText}>Submit</button>
      <button onClick={this.skip}>Skip</button>
    </div>)
  }
}

module.exports = InputMeme
