/**
 * @class Chats
 */
class Chat {
  members = [];
  last_message = {};
  type = 'public';
  description = '';
  password = '';
  /**
   *
   * @param {String} hoster Token of the hoster
   * @param {String} type
   * @param {String} description
   * @param {String} password
   */
  constructor(hoster, type, description, password) {
    this.members.push(hoster);
    this.last_message = {
      author: '',
      message: '',
    };
    this.type = type;
    this.description = description;
    this.password = password;
  }

  /**
   *
   * @param {String} member Token of the member
   */
  addMember(member) {
    this.members.push(member);
  }
  /**
   *
   * @param {String} member
   */
  removeMember(member) {
    this.members.splice(this.members.indexOf(member), 1);
  }
  /**
   *
   * @param {String} author
   * @param {String} message
   */
  say(author, message) {
    this.last_message = {
      author,
      message,
    };
  }

  getState() {
    return {
      members: this.members,
      last_message: this.last_message,
      type: this.type,
      description: this.description    
    };
  }
}

module.exports = {
  Chat,
};
