const {Network} = require('./lib/network');

const network = new Network(8080);

network.on('message', (clientID, msg) => {
  console.log(clientID, msg);
});
