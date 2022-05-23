const {Mutex} = require('async-mutex');
const {Chat} = require('./states/chat');


/**
 * @class States
 */
class States {
  chats = [];
  users = [];
  rooms = [];

  /**
   *
   */
  constructor() {
    this.chats = {};
    this.users = [];
    this.rooms = [];

    this.chats['global'] = {
      mutex: new Mutex(),
      entity: new Chat('global', 'public', 'global chat'),
      releaseFunc: null,
    };

    this.chatMutex = new Mutex();
    this.userMutex = new Mutex();
    this.roomMutex = new Mutex();
  }

  /**
   *
   * @param {String} name
   * @param {Chat} chat
   * @return {Boolean}
   */
  addChat(name, chat) {
    if (name in this.chats && this.chats[name] != null) return false;
    this.chats[name] = {
      mutex: new Mutex(),
      entity: chat,
      releaseFunc: null,
    };
  }

  joinChat(name, username) {

  }

  /**
   *
   * @param {String} chatName
   * @return {Boolean}
   */
  async removeChat(chatName) {
    if (!(chatName in this.chats)) return true;

    const release = await this.chats[chatName].mutex.acquire();
    // it will automatically removed due to garbage collection
    const chat = this.chats[chatName];
    this.chats[chatName] = null;
    release();
  }

  /**
   *
   * @param {String} chatName
   * @param {Chat} chat
   */
  async assignChat(chatName, chat) {
    const release = await this.chats[chatName].mutex.acquire();
    this.chats[chatName] = chat;
    release();
  }

  releaseChat(chatName) {
    if (this.chats[chatName].releaseFunc == null) return false;

    this.chats[chatName].releaseFunc();
    this.chats[chatName].releaseFunc = null;
  }

  async lockChat(chatName) {
    if (this.chats[chatName].releaseFunc != null) return false;

    console.log(chatName);
    console.log(this.chats[chatName]);
    this.chats[chatName].releaseFunc = await this.chats[chatName].mutex.acquire();
  }

  getChat(chatName) {
    return this.chats[chatName].entity;
  }
}

module.exports = {
  States,
};
