const {Room} = require('../lib/states/room');
const {User} = require('../lib/states/user');
const {Chat} = require('../lib/states/chat');

const {States} = require('../lib/states');

const states = new States();

const room1 = new Room('testRoom');
const chat1 = new Chat('testHoster', 'room', 'description', '');
const user = new User('testUser', 0, 0, 0, 0, 0);
const user1 = new User('testUser1', 0, 0, 0, 0, 0);

states.addChat(chat1);
states.addUser(user);
states.addUser(user1);
states.addRoom(room1);

// write ur code in `lib/states.js`
console.log(states.dumpState());
