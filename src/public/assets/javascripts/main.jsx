window.WebSocket = window.WebSocket || window.MozWebSocket;
const connection = new WebSocket('ws://localhost:1337')
connection.onopen = () => {
  console.log('websocket connected')
}
connection.onclose= () => {
  window.mainApp.errorState('socket closed')
}

window.shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const appConfig = {
  recordTime: 4,
  countdownTime: 3,
  resetTime: 5
}
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')

window.onkeypress = (event) => {
  if ( event.code === "Space" ) {
    window.mainApp.handleSpacePress(event)
  } else if ( event.code === "Enter" ) {
    window.mainApp.handleEnterPress(event)
    window.document.getElementById('smsNumberField').focus()
  }
}

ReactDOM.render(<App socket={connection} config={appConfig} ref={(c) => window.mainApp = c} />, document.getElementById('root'))
