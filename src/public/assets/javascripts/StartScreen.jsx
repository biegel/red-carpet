const React = require('react')
const ReactDOM = require('react-dom')

class StartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = props.begin
  }
  render() {
    return (<div>
      <h1>Press the button to start!</h1>
      <button onClick={this.handleClick}>Start</button>
    </div>)
  }
}

module.exports = StartScreen
