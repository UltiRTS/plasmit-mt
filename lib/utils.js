const charsSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CMD = {
  'CREATECHAT': ['username', 'chatName', 'password', 'description'].sort(),
  'JOINCHAT': ['username', 'chatName'].sort(),
  'SAYCHAT': ['username', 'chatName', 'message'].sort(),
};


/**
 *
 * @param {Number} len
 * @return {String}
 */
function genRandomString(len) {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += charsSet[Math.floor(Math.random() * charsSet.length)];
  }
  return result;
}

/**
 *
 * @param {String} cmd
 * @param {[String]} parameters
 * @return {Boolean}
 */
function fullfilParameters(cmd, parameters) {
  if (parameters === undefined) return false;

  const requiredParameters = CMD[cmd];

  if (parameters.length !== requiredParameters.length) return false;

  parameters = parameters.sort();
  for (let i=0; i<requiredParameters.length; i++) {
    if (parameters[i] !== requiredParameters[i]) return false;
  }

  return true;
}


module.exports = {
  fullfilParameters,
  genRandomString,
};
