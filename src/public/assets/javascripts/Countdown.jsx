const React = require('react')
const ReactDOM = require('react-dom')

class Countdown extends React.Component {
  constructor(props) {
    super(props)
    this.callback = props.callback
    this.state = {
      count: props.ticks
    }
  }
  componentDidMount() {
    this.nextTick()
  }
  componentWillUnmount() {
    clearTimeout(this.ticker)
  }
  nextTick() {
    this.ticker = setTimeout(() => this.tick(), 1000)
  }
  tick() {
    this.setState({
      count: this.state.count - 1
    })
    if ( this.state.count === 0 ) {
      if ( typeof this.callback === 'function' ) {
        this.callback()
      }
    } else {
      this.nextTick()
    }
  }
  render() {
    return (<div className="countdown">{this.state.count}</div>)
  }
}

module.exports = Countdown
