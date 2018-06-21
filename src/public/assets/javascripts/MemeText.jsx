const React = require('react')

class MemeText extends React.Component {
  constructor(props) {
    super(props)
    this.text = props.text
  }
  render() {
    return (<div className="memeText">{this.props.text}</div>)
  }
}

module.exports = MemeText
