const React = require('react')
const ReactDOM = require('react-dom')

class StartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = props.begin
  }
  render() {
    return (<div className="startScreen">
      <h1>WELCOME TO THE RED CARPET</h1>
      <h2>PRESS THE RED BUTTON TO START!</h2>
      <button onClick={this.handleClick}>or click here</button>
    </div>)
  }
}

module.exports = StartScreen
