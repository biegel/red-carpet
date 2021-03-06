const React = require('react')

class Gif extends React.Component {
  constructor(props) {
    super(props)
    this.gifId = props.gifId
    this.resetCachebust()
  }
  componentWillUnmount() {
    this.resetCachebust() 
  }
  resetCachebust() {
    this.cachebust = (new Date()*1).toString()
  }
  render() {
    let gifSource
    if ( this.gifId ) {
      gifSource = `/public/gif/rc_${this.gifId}.gif?_=${this.cachebust}`
    } else {
      gifSource = `/workspace/working.gif?_=${this.cachebust}`
    }
    return (<div className="gifContainer"><img src={gifSource} /></div>)
  }
}

module.exports = Gif
