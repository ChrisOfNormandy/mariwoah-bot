const AWS = require("aws-sdk");
const adapter = require('./helpers/adapter');

/**
 * Login handler for AWS communication using credentials provided in the system config.
 * @returns {Promise<{credentials: AWS.Credentials, AWS: >} AWS credentials JSON.
 */
function login(creds) {
  return new Promise((resolve, reject) => {
    AWS.config.loadFromPath(creds);

    AWS.config.getCredentials((err) => {
      if (err)
        reject(err);
      else {
        resolve({ credentials: AWS.config.credentials, AWS: AWS });
      }
    });
  });
}

module.exports = {
  AWS,
  login
};