const {parentPort} = require('node:worker_threads');
const {DataManager} = require('../db/dataManager');
const {dbConfig}= require('../config');
const {Chat} = require('./states/chat');

const knexConf = dbConfig[dbConfig.useDB];

const dbm = new DataManager(knexConf);

parentPort.on('message', (msg) => {
  if (msg.action === undefined) return;

  switch (msg.action) {
    case 'CREATECHAT': {
      break;
    }
    case 'JOINCHAT': {
      const {hosterName, password, description, chatName} = msg.parameters;
      const chat = new Chat(hosterName, 'public', description, password);

      parentPort.postMessage({
        action: 'JOINCHAT',
        parameters: {
          chatName: chatName,
        },
        payload: {
          chat: chat,
        },
      });
      break;
    }

    case 'SAYCHAT': {
      const parameters = msg.parameters;
      const payload = msg.payload;
      const {chatName, author, message} = parameters;
      const {chat} = payload;


      Object.setPrototypeOf(chat, Chat.prototype);

      chat.say(author, message);

      parentPort.postMessage({
        action: 'SAYCHAT',
        parameters: {
          chatName: chatName,
        },
        payload: {
          chat: chat,
        },
      });
      break;
    }
  }
});
