const {WebSocketServer} = require('ws');
const {EventEmitter} = require('events');
const {genRandomString} = require('./utils');
const {NetworkErrors} = require('./errors');

/**
 * @class Network
 */
class Network extends EventEmitter {
  /**
   *
   * @param {Number} port
   * @param {object} options for event emitter and other options
   */
  constructor(port, options={}) {
    super(options);
    this.server = new WebSocketServer({port});
    this.clients = {};

    this.server.on('listening', () => {
      console.log('server listening');
    });

    // network event callbacks
    this.server.on('connection', (ws, req) => {
      let clientID = genRandomString(16);
      while (clientID in this.clients) clientID = genRandomString(10);

      this.clients[clientID] = ws;


      ws.on('message', (msg) => {
        this.emit('message', clientID, JSON.parse(msg));
      });
    });

    // event callbacks
    this.on('postMessage', (clientID, msg) => {
      if (clientID in this.clients) this.clients[clientID].send(msg);
    });

    console.log('constructor');
  }
}


module.exports = {
  Network,
};
