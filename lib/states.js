const { Mutex } = require('async-mutex');
const { Chat } = require('./states/chat');
const { User } = require('./states/user');
const { Room } = require('./states/room');


/**
 * @class States
 */
class States {
  chats = {};
  users = {};
  rooms = {};

  /**
   *
   */
  constructor() {
    this.chats = {};
    this.users = {};
    this.rooms = {};

    this.chats['global'] = {
      mutex: new Mutex(),
      entity: new Chat('global', 'public', 'global chat'),
      releaseFunc: null,
    };
  }

  /**
   *
   * @param {String} roomName
   * @param {Room} room
   * @return {Boolean}
   */
  addRoom(roomName, room) {
    if (roomName in this.rooms && this.rooms[roomName] != null) return false;

    this.rooms[roomName] = {
      mutex: new Mutex(),
      entity: room,
      releaseFunc: null,
    };

    return true;
  }

  /**
   *
   * @param {String} roomName
   * @return {Boolean}
   */
  async removeRoom(roomName) {
    if (!(roomName in this.rooms)) return true;

    const release = await this.rooms[roomName].mutex.acquire();
    this.rooms[roomName] = null;
    release();

    return true;
  }

  /**
   *
   * @param {String} roomName
   * @param {Room} room
   */
  async assignRoom(roomName, room) {
    const release = await this.rooms[roomName].mutex.acquire();
    this.rooms[roomName].entity = room;
    release();
  }

  /**
   *
   * @param {String} roomName
   * @return {Boolean}
   */
  async lockRoom(roomName) {
    if (this.rooms[roomName].releaseFunc != null) return false;

    this.rooms[roomName].releaseFunc =
      await this.rooms[roomName].mutex.acquire();

    return true;
  }

  /**
   *
   * @param {String} roomName
   * @return {Boolean}
   */
  releaseRoom(roomName) {
    if (this.rooms[roomName].releaseFunc == null) return false;

    this.rooms[roomName].releaseFunc();
    this.rooms[roomName].releaseFunc = null;

    return true;
  }

  /**
   *
   * @param {String} username
   * @param {User} user
   * @return {Boolean}
   */
  addUser(username, user) {
    if (username in this.users && this.users[username] != null) return false;
    this.users[username] = {
      mutex: new Mutex(),
      entity: user,
      releaseFunc: null,
    };

    return true;
  }

  /**
   *
   * @param {String} username
   * @param {User} user
   */
  assignUser(username, user) {
    const release = this.users[username].mutex.acquire();
    this.users[username].entity = user;
    release();
  }

  /**
   *
   * @param {String} username
   * @return {Boolean}
   */
  removeUser(username) {
    if (!(username in this.users)) return true;

    const release = this.users[username].mutex.acquire();
    const user = this.users[username];
    this.users[username] = null;
    release();

    return true;
  }

  /**
   *
   * @param {String} username
   * @return {Boolean}
   */
  async lockUser(username) {
    if (this.users[username].releaseFunc != null) return false;

    this.users[username].releaseFunc =
      await this.users[username].mutex.acquire();

    return true;
  }

  /**
   *
   * @param {String} username
   * @return {Boolean}
   */
  releaseUser(username) {
    if (this.users[username].releaseFunc == null) return false;

    this.users[username].releaseFunc();
    this.users[username].releaseFunc = null;

    return true;
  }

  /**
   *
   * @param {String} chatName
   * @param {Chat} chat
   * @return {Boolean}
   */
  addChat(chatName, chat) {
    if (chatName in this.chats && this.chats[chatName] != null) return false;
    this.chats[chatName] = {
      mutex: new Mutex(),
      entity: chat,
      releaseFunc: null,
    };

    return true;
  }

  /**
   *
   * @param {String} chatName
   * @return {Boolean}
   */
  async removeChat(chatName) {
    if (!(chatName in this.chats)) return true;

    const release = await this.chats[chatName].mutex.acquire();
    // it will be automatically removed due to garbage collection
    const chat = this.chats[chatName];
    this.chats[chatName] = null;
    release();

    return true;
  }

  /**
   *
   * @param {String} chatName
   * @param {Chat} chat
   */
  async assignChat(chatName, chat) {
    const release = await this.chats[chatName].mutex.acquire();
    this.chats[chatName].entity = chat;
    release();
  }

  /**
   *
   * @param {String} chatName
   * @return {Boolean}
   */
  releaseChat(chatName) {
    if (this.chats[chatName].releaseFunc == null) return false;

    this.chats[chatName].releaseFunc();
    this.chats[chatName].releaseFunc = null;

    return true;
  }

  /**
   *
   * @param {String} chatName
   * @return {Boolean}
   */
  async lockChat(chatName) {
    if (this.chats[chatName].releaseFunc != null) return false;

    this.chats[chatName].releaseFunc =
      await this.chats[chatName].mutex.acquire();

    return true;
  }

  /**
   *
   * @param {String} chatName
   * @return {Chat}
   */
  getChat(chatName) {
    return this.chats[chatName].entity;
  }

  /**
   *
   * @param {String} chatName
   * @return {Boolean}
   */
  existsChat(chatName) {
    return chatName in this.chats;
  }

  dumpState(userEntity) {
    const userName = userEntity;
    this.lockUser();
    const stateDump = {
      allRooms: [],
      allUsers: [],
      joinedChats: [],
    }
    // get a list of chats the user is in
    const chatList = [];

    // lock all those chats
    for (const chatName of chatList) {
      this.lockChat(chatName);
    }
    for (const chatName in this.chats) {
      if (this.chats[chatName].entity.members.hasUser(userName)) {
        chatList.push(entity);
      }
    }


    for (const entity of chatList) {
      stateDump.joinedChats.push(entity.getState());
    }

    // unlock all those chats
    for (const chatName of chatList) {
      this.releaseChat(chatName);
    }

    // lock all rooms

    for (const roomName in this.rooms) {
      this.lockRoom(roomName);
    }

    for (const singleGame of this.rooms) {
      stateDump.allRooms.push(singleGame.getState());
    }

    // unlock all rooms
    for (const roomName in this.rooms) {
      this.releaseRoom(roomName);
    }

    // lock all users
    for (const userName in this.users) {
      this.lockUser(userName);
    }

    for (const singleUser of this.users) {
      stateDump.allUsers.push(singleUser.getState());
    }

    // unlock all users
    for (const userName in this.users) {
      this.releaseUser(userName);
    }

    return stateDump;


  }
}

module.exports = {
  States,
};
