window.WebSocket = window.WebSocket || window.MozWebSocket;
const connection = new WebSocket('ws://localhost:1337')
connection.onopen = () => {
  console.log('websocket connected')
}

window.shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const appConfig = {
  recordTime: 5,
  countdownTime: 1,
  resetTime: 10
}
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')

window.onkeypress = (event) => {
  if ( event.code === "Space" ) {
    window.mainApp.handleRedButton(event)
  }
}

ReactDOM.render(<App socket={connection} config={appConfig} ref={(c) => window.mainApp = c} />, document.getElementById('root'))
