const AWS = require("aws-sdk");
const config = require('../../config/config.json');

function login() {
  AWS.config.loadFromPath(config.auth.aws);

  AWS.config.getCredentials((err) => {
    if (err)
      console.error(err);
    else
      console.log("Logged in to AWS using access key:", AWS.config.credentials.accessKeyId);
  });
}

module.exports = {
  AWS,
  login
}