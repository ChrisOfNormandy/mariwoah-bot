const fs = require('fs');
const path = require('path');

let s3 = null;

const _bucket = {
    /**
     * Fetches a list of available buckets within S3.
     * @returns {Promise<AWS.S3.ListBucketsOutput>} Returns bucket list.
     */
    list: () => {
        return new Promise((resolve, reject) => {
            s3.listBuckets((err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
     * Creates a new bucket within S3.
     * @returns {Promise<AWS.S3.CreateBucketOutput>} Returns output from bucket creation.
     * @param {string} bucket Bucket name.
     */
    create: (bucket) => {
        const bucketParams = {
            Bucket: bucket
        };

        s3.createBucket(bucketParams, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    }
};

const _object = {
    /**
     * Fetches a list of objects from a bucket within S3.
     * @returns {Promise<AWS.S3.ObjectList>} Returns list of objects.
     * @param {string} bucket Bucket name.
     */
    list: (bucket, prefix = null) => {
        return new Promise((resolve, reject) => {
            let params = { Bucket: bucket };
            if (prefix !== null)
                params['Prefix'] = prefix;

            s3.listObjectsV2(params, (err, list) => {
                if (err)
                    reject(err);
                else {
                    if (!!list.Contents.length)
                        resolve(list.Contents);
                    else
                        reject(list);
                }
            });
        });
    },

    /**
     * Writes and puts a file object into S3 given a file name, type and data.
     * @param {string} bucket Bucket name.
     * @param {string | null} folder Folder name; optional.
     * @param {{name: string, type: string, data: string | object}} fileObj A JSON representing a file object.
     * @returns 
     */
    putData: (bucket, folder, fileObj) => {
        if (!fileObj.name || !fileObj.data)
            return Promise.reject('Cannot put object to S3; invalid object structure.');

        return new Promise((resolve, reject) => {
            fs.writeFile(`./temp/${fileObj.name}`, fileObj.type === 'application/json' ? JSON.stringify(fileObj.data) : fileObj.data, (err) => {
                if (err)
                    reject(err);
                else {
                    _object.put(bucket, folder, fileObj.name)
                        .then(r => resolve(r))
                        .catch(err => reject({ error: err, message: 'Failed to put object in S3.' }));
                }
            });
        });
    },

    /**
     * Puts a file by path to S3.
     * @returns {Promise<{ folder: AWS.S3.PutObjectOutput, data: AWS.S3.PutObjectOutput }>} Returns output of folder creation if provided, output of data put.
     * @param {string} bucket Bucket name.
     * @param {string | null} folder Folder name. If null (not string) will ignore and put in bucket directly.
     * @param {string} file Object name.
     */
    put: (bucket, folder, file) => {
        return new Promise((resolve, reject) => {
            let stream;
            let isTemp = !fs.existsSync(file) || path.basename(file) === file;

            if (!isTemp)
                stream = fs.createReadStream(file);
            else
                stream = fs.createReadStream(`./temp/${path.basename(file)}`);

            stream.on('error', (err) => reject(err));

            const dirUploadParams = { Bucket: bucket, Key: `${folder}/`, Body: '' };
            const uploadParams = { Bucket: folder === null ? bucket : `${bucket}/${folder}`, Key: path.basename(file), Body: stream };

            let returns = {
                folder: null,
                data: null
            }

            s3.listObjectsV2({ Bucket: bucket }, (err, exists) => {
                if (err)
                    reject(err);
                else {
                    if (!exists.Contents.length && folder !== null) {
                        s3.putObject(dirUploadParams, (err, data) => {
                            if (err)
                                reject(err);
                            else {
                                returns.folder = data;

                                s3.putObject(uploadParams, (err, data) => {
                                    if (err)
                                        reject(err);
                                    else {
                                        returns.data = data;

                                        if (isTemp)
                                            fs.rm(`./temp/${path.basename(file)}`, (err) => {
                                                if (err)
                                                    console.error(err)
                                                else
                                                    resolve(returns);
                                            });
                                        else
                                            resolve(returns);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        s3.putObject(uploadParams, (err, data) => {
                            if (err)
                                reject(err);
                            else {
                                returns.data = data;

                                if (isTemp)
                                    fs.rm(`./temp/${path.basename(file)}`, (err) => {
                                        if (err)
                                            console.error(err)
                                        else
                                            resolve(returns);
                                    });
                                else
                                    resolve(returns);
                            }
                        });
                    }
                }
            });
        });
    },

    /**
     * Not implemented.
     * @deprecated
     * @param {string} bucket 
     * @param {string | null} folder 
     * @param {string} key 
     * @param {fs.ReadStream} stream 
     * @returns 
     */
    putByStream: (bucket, folder, key, stream) => {
        return new Promise((resolve, reject) => {
            const dirUploadParams = { Bucket: bucket, Key: `${folder}/`, Body: '' };
            const uploadParams = { Bucket: folder === null ? bucket : `${bucket}/${folder}`, Key: key, Body: stream };

            let returns = {
                folder: null,
                data: null
            }

            s3.listObjectsV2({ Bucket: bucket }, (err, exists) => {
                if (err)
                    reject(err);
                else {
                    if (!exists.Contents.length && folder !== null) {
                        s3.putObject(dirUploadParams, (err, data) => {
                            if (err)
                                reject(err);
                            else {
                                returns.folder = data;

                                s3.putObject(uploadParams, (err, data) => {
                                    if (err)
                                        reject(err);
                                    else {
                                        returns.data = data;

                                        resolve(returns);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        s3.putObject(uploadParams, (err, data) => {
                            if (err)
                                reject(err);
                            else {
                                returns.data = data;

                                resolve(returns);
                            }
                        });
                    }
                }
            });
        });
    },

    /**
     * Fetches an object from a bucket within S3.
     * @returns {Promise<AWS.S3.GetObjectOutput>} Returns object from bucket.
     * @param {string} bucket Bucket name.
     * @param {string} key Object name.
     */
    get: (bucket, key) => {
        return new Promise((resolve, reject) => {
            s3.getObject({ Bucket: bucket, Key: key }, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
     * Fetches an object as a file from a bucket within S3.
     * @returns {Promise<AWS.S3.GetObjectOutput>} Returns object from bucket.
     * @param {string} bucket Bucket name.
     * @param {string} key Object name.
     */
    getRaw: (bucket, key) => {
        return s3.getObject({ Bucket: bucket, Key: key });
    },

    /**
     * Deletes a bucket from S3. Not implemented.
     * @deprecated
     * @returns {Promise<AWS.S3.DeleteObjectOutput>} Returns output of object deletion.
     * @param {string} bucket Bucket name.
     * @param {string} file Object name.
     */
    delete: (bucket, file) => {
        return new Promise((resolve, reject) => {
            s3.deleteObject({ Bucket: bucket, Key: file }, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
     * Deletes a folder object from a bucket within S3. Not implemented.
     * @deprecated
     * @returns {Promise<AWS.S3.DeleteObjectOutput>} Returns output of object deletion.
     * @param {string} bucket Bucket name.
     * @param {string} folder Folder name.
     */
    deleteFolder: (bucket, folder) => {
        return new Promise((resolve, reject) => {
            s3.deleteObject({ Bucket: `${bucket}/${folder}/` }, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
};

module.exports = {
    bucket: _bucket,
    object: _object,
    setup: (AWS) => {
        s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    }
}