/* eslint-disable require-jsdoc */
class User {
  id = 0;
  username = '';
  accessLevel = 0;
  exp = 0;
  sanity = 0;
  isBlocked = 0;

  constructor(username, accessLevel, exp, sanity, isBlocked) {
    this.username = username;
    this.accessLevel = accessLevel;
    this.exp = exp;
    this.sanity = sanity;
    this.isBlocked = isBlocked;
  }

  getState() {
    return {
      id: this.id,
      username: this.username,
      accessLevel: this.accessLevel,
      exp: this.exp,
      sanity: this.sanity,
      isBlocked: this.isBlocked,
    };
  }
}

module.exports = {
  User,
};
