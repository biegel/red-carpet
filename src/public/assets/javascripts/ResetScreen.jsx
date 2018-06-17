const React = require('react')
const Countdown = require('./Countdown')

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class ResetScreen extends React.Component {
  constructor(props) {
    super(props)
    this.callback = props.callback
    this.ticks = props.ticks
    this.messages = [
      "Get a drink gurl!",
      "Is that shirt from Target?",
      "Nice outfit!",
      "Cute look!",
      "Werk that carpet bitch!",
      "FIERCE!",
      "Check out the sling!",
      "Give Tom a kiss!",
      "Give the bartender a kiss!",
      "Now do it again in heels."
    ]
    this.mainMessage = shuffle(this.messages).pop()
  }
  componentDidMount() {
    this.timeoutId = setTimeout(() => this.reset(), this.ticks * 1000)
  }
  reset() {
    this.callback()
  }
  render() {
    return (<div>
      <div className="done">All Done!</div>
      <div className="message">{this.mainMessage}</div>
      <div className="reset">Resetting in</div>
      <Countdown ticks={this.ticks} callback={this.callback} />
    </div>)
  }
}

module.exports = ResetScreen
