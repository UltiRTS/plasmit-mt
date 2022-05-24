const {Network} = require('./lib/network');
const {Worker} = require('node:worker_threads');
const {States} = require('./lib/states');
const {Chat} = require('./lib/states/chat');
const {randomInt} = require('node:crypto');
const {fullfilParameters} = require('./lib/utils');

const network = new Network(8080);
const states = new States();
const workers = [];
// username -> clientID
const userMapping = {};

const AccessPartition = {
  everyone: [
    'LOGIN',
    'REGISTER',
  ],
  player: [
    'JOINCHAT',
    'SAYCHAT',
  ],
  admin: [
    'SETSETTING',
  ],
};

// dispather
network.on('message', async (clientID, msg) => {
  console.log(clientID, msg);

  let privilege = 'everyone';


  if (!(clientID in userMapping)) {
    privilege = 'everyone';
  } else if (clientID in userMapping) {
  }

  switch (msg.action) {
    case 'JOINCHAT': {
      userMapping[msg.parameters.username] = clientID;

      if (msg.parameters.chatName) {
        workers[randomInt(0, workers.length)].postMessage(msg);
      }
      break;
    }
    case 'SAYCHAT': {
      const parameters = msg.parameters;
      const {chatName} = parameters;
      await states.lockChat(chatName);
      const chat = states.getChat(chatName);

      const msgIn = {
        ...msg,
        payload: {
          chat: chat,
        },
      };
      workers[randomInt(0, workers.length)].postMessage(msgIn);
      break;
    }
  }
});

// worker bindings
for (let i=0; i<4; i++) {
  const worker = new Worker('./lib/worker.js');
  // listeners for states alternation
  worker.on('message', (msg) => {
    console.log(`worker ${worker.threadId} message`, msg);

    switch (msg.action) {
      case 'JOINCHAT': {
        const {chat} = msg.payload;
        const {chatName} = msg.parameters;
        states.addChat(chatName, chat);

        console.log(chat.members);

        // eslint-disable-next-line guard-for-in
        for (const username of chat.members) {
          console.log(username);
          console.log(userMapping);
          clientID = userMapping[username];
          network.emit('postMessage', clientID, {
            action: 'JOINCHAT',
            parameters: {
            },
          });
        }

        break;
      }
      case 'SAYCHAT': {
        const {chat} = msg.payload;
        const {chatName} = msg.parameters;
        states.assignChat(chatName, chat);
        states.releaseChat(chatName);
        break;
      }
    }
  });

  worker.on('exit', (code) => {
    console.log('worker exit', worker.threadId, code);
  });

  worker.on('online', () => {
    console.log('worker online', worker.threadId);
  });


  workers.push(worker);
}
