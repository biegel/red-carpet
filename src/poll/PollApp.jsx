const React = require('react')
const axios = require('axios')

class PollApp extends React.Component {
  constructor(props) {
    super(props)
    this.initialState = {
      count: null,
      gifList: []
    }
    this.state = this.initialState
    this.pollId = null
    this.shuffleId = null
    this.screenCount = 9

    this.startPoll = this.startPoll.bind(this)
    this.getCurrentCount = this.getCurrentCount.bind(this)
  }
  componentDidMount() {
    this.getCurrentCount()
  }
  componentDidUpdate(prevProps, prevState) {
    if ( prevState.count !== this.state.count ) {
      console.log(`count change (old: ${prevState.count} new: ${this.state.count})`)
      this.updateGifList()
    }
  }
  updateGifList() {
    let tempArr = Array.apply(null, {length: this.state.count}).map(Number.call, Number)
    tempArr = tempArr.reverse().slice(0, this.screenCount)
    this.setState({ gifList: tempArr })
  }
  startPoll() {
    clearTimeout(this.pollId)
    this.pollId = setTimeout(() => this.getCurrentCount(), this.props.config.pollTimeout*1000)
  }
  getCurrentCount() {
    axios.get(this.props.config.countUrl).then((response) => {
      this.setState({ count: response.data })
      this.startPoll()
    })
  }
  render() {
    const imageSrc = this.state.gifList.map((id) => `http://biegel.com/app/redcarpet/rc_${id}.gif`)
    console.log(imageSrc)
    return (<div className="gifContainer"><div className="mainGif"><img src={imageSrc[0]} /></div>
      <div className="container">{this.state.gifList.slice(1).map((id, index) => {
        const k = `gif${id}`
        return <img key={k} src={imageSrc[index]} />
      })}</div>
    </div>)
  }
}

module.exports = PollApp
