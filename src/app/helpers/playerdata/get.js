const { s3 } = require('../../../aws/helpers/adapter');

/**
 * Used for getting a file from S3.
 * @param {string} userID 
 * @returns 
 */
module.exports = (userID) => {
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `user-data/players/${userID}.json`)
            .then(data => resolve(JSON.parse(data.Body.toString())))
            .catch(err => reject(err));
    });
};