const AWS = require("aws-sdk");
const config = require('../../config/config.json');

/**
 * Login handler for AWS communication using credentials provided in the system config.
 * @returns {Promise<AWS.Credentials>} AWS credentials JSON.
 */
function login(creds) {
  return new Promise((resolve, reject) => {
    AWS.config.loadFromPath(creds);

    AWS.config.getCredentials((err) => {
      if (err)
        reject(err);
      else
        resolve({ credentials: AWS.config.credentials, aws: AWS });
    });
  });
}

module.exports = {
  AWS,
  login
};