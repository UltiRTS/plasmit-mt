const {WebSocket} = require('ws');

const client = new WebSocket('ws://localhost:8080');


client.on('open', () => {
  console.log('client open');
  client.send(JSON.stringify({
    action: 'JOINCHAT',
    parameters: {
      hosterName: 'test',
      password: 'test',
      description: 'test',
      chatName: 'test',
    },
  }));
});

client.on('message', (msg) => {
  console.log(JSON.parse(msg));
});


// client.send(JSON.stringify({
//   action: 'SAYCHAT',
//   parameters: {
//     chatName: 'test',
//     author: 'test',
//     message: 'test',
//   }}))
