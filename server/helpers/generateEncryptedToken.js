const Cryptr = require("cryptr");
const { Config } = require("../config");

const generateEncryptedToken = (mongoId, minutes = Config.FILE_LINK_EXPIRY_IN_MINUTES) => {
  const cryptr = new Cryptr(Config.CRYPTR_TOKEN); // Replace with your secret key
  const currentTime = new Date().getTime();
  console.log("currentTime",currentTime)
  const expirationTime = new Date(
    currentTime + minutes * 20*1000
  ).getTime();
  const tokenString = `${expirationTime}-${mongoId}`;
  const encryptedToken = cryptr.encrypt(tokenString);
  return encryptedToken;
};
module.exports = generateEncryptedToken;
