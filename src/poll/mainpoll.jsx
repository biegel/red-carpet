window.shuffle = function (a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const appConfig = {
  pollTimeout: 5,
  countUrl: 'http://localhost:3001/proxy',//http://biegel.com/app/redcarpet/gif.count'
};

const React = require('react');
const ReactDOM = require('react-dom');
const PollApp = require('./PollApp');

ReactDOM.render(<PollApp config={appConfig} ref={(c) => window.mainPoll = c} />, document.getElementById('root'))
