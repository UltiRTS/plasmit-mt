const charsSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function genRandomString() {
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += charsSet[Math.floor(Math.random() * charsSet.length)];
  }
  return result;
}


module.exports = {
  genRandomString,
};
