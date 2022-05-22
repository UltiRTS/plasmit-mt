const {WebSocket} = require('ws');

const client = new WebSocket('ws://localhost:8080');


client.on('open', () => {
  console.log('client open');
  client.send(JSON.stringify({
    a: 1,
  }));
});

client.on('message', (msg) => {
  console.log(msg);
});
