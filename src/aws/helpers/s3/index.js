const AWS = require('../../aws-link').AWS;
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const _bucket = {
    /**
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
     * @returns {Promise<AWS.S3.CreateBucketOutput>} Returns output from bucket creation.
     * @param {string} bucketName Name of bucket to be created.
     */
    create: (bucketName) => {
        const bucketParams = {
            Bucket: bucketName
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
     * @returns {Promise<AWS.S3.ObjectList>} Returns list of objects.
     * @param {string} bucket Bucket name.
     */
    list: (bucket, path = null) => {
        const params = path === null
            ? {Bucket: bucket}
            : {Bucket: bucket, Prefix: path};

        return new Promise((resolve, reject) => {
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

    putData: (bucket, folder, fileObj) => {
        console.log(fileObj);
        return new Promise((resolve, reject) => {
            fs.writeFile(`./temp/${fileObj.name}`, fileObj.type === 'application/json' ? JSON.stringify(fileObj.data) : fileObj.data, (err) => {
                if (err)
                    reject(err);
                else {
                    _object.put(bucket, folder, `./temp/${fileObj.name}`)
                    .then(r => {
                        fs.unlink(`./temp/${fileObj.name}`, (err) => {
                            if (err)
                                reject(err);
                            else
                                resolve(r);
                        });
                    })
                    .catch(err => reject(err));
                }
            });
        });
    },

    /**
     * @returns {Promise<{ folder: AWS.S3.PutObjectOutput, data: AWS.S3.PutObjectOutput }>} Returns output of folder creation if provided, output of data put.
     * @param {string} bucket Bucket name.
     * @param {string | null} folder Folder name. If null (not string) will ignore and put in bucket directly.
     * @param {string} file Object name.
     */
    put: (bucket, folder, file) => {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file);
            stream.on('error', (err) => reject(err));

            const dirUploadParams = { Bucket: bucket, Key: `${folder}/`, Body: '' };
            const uploadParams = { Bucket: folder === null ? bucket : `${bucket}/${folder}`, Key: path.basename(file), Body: stream };

            let returns = {
                folder: null,
                data: null
            };

            s3.listObjectsV2({ Bucket: bucket }, (err, exists) => {
                if (err)
                    reject(err);
                else {
                    if (!!!exists.Contents.length && folder !== null) {
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
                    if (!!!exists.Contents.length && folder !== null) {
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
     * @returns {Promise<AWS.S3.GetObjectOutput>} Returns object from bucket.
     * @param {string} bucket 
     * @param {string} key 
     */
    get: (bucket, key) => {
        return new Promise((resolve, reject) => {
            s3.getObject({Bucket: bucket, Key: key}, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
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
     * @returns {Promise<AWS.S3.DeleteObjectOutput>} Returns output of object deletion.
     * @param {string} bucket Bucket name.
     * @param {string} folder Folder name.
     */
    deleteFolder: (bucket, folder) => {
        return new Promise((resolve, reject) => {
            s3.deleteObject({Bucket: `${bucket}/${folder}/`}, (err, data) => {
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
    object: _object
}