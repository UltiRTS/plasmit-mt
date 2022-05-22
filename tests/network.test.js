const {Network} = require('../lib/network');

const network = new Network(8080, {});

network.emit('hello', 'world');
