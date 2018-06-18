window.WebSocket = window.WebSocket || window.MozWebSocket;
const connection = new WebSocket('ws://localhost:3000')
connection.onopen = () => {
  console.log('websocket connected')
}

const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
const mainApp = <App socket={connection} />

ReactDOM.render(mainApp, document.getElementById('root'))
