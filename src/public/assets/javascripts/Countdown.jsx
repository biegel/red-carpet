const React = require('react')
const ReactDOM = require('react-dom')

class Countdown extends React.Component {
  constructor(props) {
    super(props)
    this.callback = props.callback
    if ( props.tickCallback ) {
      this.tickCallback = props.tickCallback
    }
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
    if ( this.tickCallback ) {
      this.tickCallback(this.state.count)
    }
    if ( this.state.count === 0 ) {
      if ( typeof this.callback === 'function' ) {
        this.callback()
      }
    } else {
      this.nextTick()
    }
  }
  render() {
    const cls = `countdown c${this.state.count}`
    return (<div className={cls}>{this.state.count}</div>)
  }
}

module.exports = Countdown
