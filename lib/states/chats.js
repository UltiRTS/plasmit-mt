class chatsPrototype {
  constructor() {
    this.chats = {};
  }

  chatFactory(id, chatType, chatDescription, chatPassword) {
    return {'chatAuthor': '', 'lastMessage': '', 'allMembers': [], 'id': id, 'type': chatType, 'description': chatDescription, 'password': chatPassword};
  }

  createNewChat(chatname, id, chatType, chatDescription, chatPassword) {
    this.chats[chatname] = this.chatFactory(id, chatType, chatDescription, chatPassword);
  }

  chatMemberJoinChat(chatname, member) {
    this.chats[chatname].allMembers.push(member);
  }

  chatMemberLeaveChat(chatname, member) {
    this.chats[chatname].allMembers.splice(this.chats[chatname].allMembers.indexOf(member), 1);
  }
}


module.exports = {
  chatsPrototype,
};
