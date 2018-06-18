window.WebSocket = window.WebSocket || window.MozWebSocket;
const connection = new WebSocket('ws://localhost:1337')
connection.onopen = () => {
  console.log('websocket connected')
}

const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App')
const socket = require('./socket')
const mainApp = <App/>

mainApp.connectSocket(connection)

ReactDOM.render(mainApp, document.getElementById('root'))
