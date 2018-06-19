window.WebSocket = window.WebSocket || window.MozWebSocket;
const connection = new WebSocket('ws://localhost:1337')
connection.onopen = () => {
  console.log('websocket connected')
}

const appConfig = {
  recordTime: 5,
  countdownTime: 5,
  resetTime: 10
}
const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
const mainApp = <App socket={connection} config={appConfig} />

ReactDOM.render(mainApp, document.getElementById('root'))
