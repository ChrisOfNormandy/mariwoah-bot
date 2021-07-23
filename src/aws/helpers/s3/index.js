const fs = require('fs'); // Used for tooltip.

/**
 * @type {AWS.S3}
 */
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
     * @param {string} name Bucket name.
     * @param {object} params Optional;
     *
     * **Bucket**: {_string_} Provided by `name`; required.\
     * **ACL**: {_string}_ private | public-read | public-read-write | authenticated-read\
     * **CreateBucketConfiguration**: {\
     * ---**LocationConstraint**: {_string_} Region name; ex: us-east-1\
     * }\
     * **GrantFullControl**: {_string_} Account ID\
     * **GrantRead**: {_string_} Account ID\
     * **GrantReadACP**: {_string_} Account ID\
     * **GrantWrite**: {_string_} Account ID\
     * **GrantWriteACP**: {_string_} Account ID\
     * **ObjectLockEnabledForBucket**: {_boolean_} Enable object lock.
     * 
     * @returns {Promise<AWS.S3.CreateBucketOutput>} Returns output from bucket creation.
     */
    create: (name, params) => {
        let bucketParams = params || {};
        bucketParams.Bucket = name;

        return new Promise((resolve, reject) => {
            s3.createBucket(bucketParams, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
     * Deletes a bucket from S3.
     * @param {string} name Bucket name.
     * @param {string} expectedBucketOwner Optional; Account ID of the expected bucket owner.\
     * Invalid owner will return `403 (Access Denied)`.
     * 
     * @returns {object} Returns empty object.
     */
    delete: (name, expectedBucketOwner) => {
        let params = {
            Bucket: name
        };

        if (!!expectedBucketOwner)
            params.ExpectedBucketOwner = expectedBucketOwner;

        return new Promise((resolve, reject) => {
            s3.deleteBucket(params, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    },

    /**
     * Gets bucket permissions.
     * @param {string} name Bucket name.
     * @returns {Promise<AWS.S3.GetBucketAclOutput>} Returns bucket permission settings.
     */
    getPerms: (name) => {
        return new Promise((resolve, reject) => {
            s3.getBucketAcl({ Bucket: name }, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
};

const _object = {
    /**
     * Fetches a list of objects from a bucket within S3.
     * @param {string} bucket Bucket name.
     * @returns {Promise<AWS.S3.ObjectList>} Returns list of objects.
     */
    list: (bucket, prefix = null) => {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: bucket
            };
            if (prefix !== null)
                params.Prefix = prefix;

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
     * Puts an object to a bucket by converting a string `data` to a binary Buffer.
     * @param {string} bucket Bucket name.
     * @param {string | null} folder Folder name; ex: `test/folder`.
     * @param {string} key File / Object name, including extension.
     * @param {string} data Data to be written to file.
     * @returns {Promise<AWS.S3.PutObjectOutput>} Returns result of `putBuffer` using supplied data.
     */
    putData: (bucket, folder, key, data) => {
        if (typeof data !== 'string')
            return Promise.reject(new Error('Data passed to Buffer must be a valid string.'));

        return new Promise((resolve, reject) => {
            _object.putBuffer(bucket, folder, key, Buffer.from(data, 'binary'))
                .then(r => resolve(r))
                .catch(err => reject(err));
        });
    },

    /**
     * Puts an object to a bucket using a provided ReadStream.
     * @param {string} bucket Bucket name.
     * @param {string} folder Folder name; ex: `test/folder`.
     * @param {string} key File / Object name, including extension.
     * @param {fs.ReadStream} stream ReadStream.
     * @returns {Promise<AWS.S3.PutObjectOutput>} Returns result of `putBuffer` using supplied stream.
     */
    put: (bucket, folder, key, stream) => {
        return _object.putBuffer(bucket, folder, key, stream);
    },

    /**
     * Puts an object to a bucket using a provided Buffer.
     * @param {string} bucket Bucket name.
     * @param {string | null} folder Folder name; ex: `test/folder`.
     * @param {string} key File / Object name, including extension.
     * @param {Buffer} buffer Buffer in; ex: `Buffer.from(data, 'binary')`.
     * @returns {Promise<AWS.S3.PutObjectOutput>}
     */
    putBuffer: (bucket, folder, key, buffer) => {
        const params = { Bucket: folder === null ? bucket : `${bucket}/${folder}`, Key: key, Body: buffer };

        return new Promise((resolve, reject) => {
            if (folder !== null)
                _object.createFolder(bucket, folder)
                    .then(() => {
                        s3.putObject(params, (err, data) => {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })
                    .catch(err => reject(err));
            else
                _object.createFolder(bucket, folder)
                    .then(() => {
                        s3.putObject(params, (err, data) => {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })
                    .catch(err => reject(err));
        });
    },

    /**
     * Fetches an object. To read body content use #Body.toString().
     * @param {string} bucket Bucket name.
     * @param {string} key File / Object name, including extension.
     * @returns {Promise<AWS.S3.GetObjectOutput>} Returns object from bucket.
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
     * Fetches an object as a raw request.
     * @param {string} bucket Bucket name.
     * @param {string} key File / Object name, including extension.
     * @returns {AWS.Request<AWS.S3.GetObjectOutput, AWS.AWSError>} Returns object request.
     */
    getRaw: (bucket, key) => {
        return s3.getObject({ Bucket: bucket, Key: key });
    },

    /**
     * Deletes an object.
     * @param {string} bucket Bucket name.
     * @param {string} file File / Object name, including extension.
     * @returns {Promise<AWS.S3.DeleteObjectOutput>} Returns empty object.
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
     * Deletes a folder and its contents.
     * @param {string} bucket Bucket name.
     * @param {string} folder Folder name.
     * @returns {Promise<AWS.S3.DeleteObjectOutput>} Returns output of object deletion.
     */
    deleteFolder: (bucket, folder) => {
        return new Promise((resolve, reject) => {
            s3.listObjectsV2({ Bucket: bucket, Prefix: folder }, (err, data) => {
                if (err)
                    reject(err);
                else {
                    if (!!data.Contents.length) {
                        let params = { Bucket: bucket, Delete: { Objects: [] } };

                        data.Contents.forEach((obj) => {
                            params.Delete.Objects.push({ Key: obj.Key });
                        });

                        s3.deleteObjects(params, (err, data) => {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    }
                    else
                        _object.delete(bucket, `${folder}/`);
                }
            });
        });
    },

    /**
     * Creates a new folder structure. Providing a pathlike folder value will create a nested folders.
     * @param {string} bucket Bucket name.
     * @param {string} folder Folder name; ex: `test/folder`.
     * @returns {Promise<boolean>}
     */
    createFolder: (bucket, folder) => {
        return new Promise((resolve, reject) => {
            s3.listObjectsV2({ Bucket: bucket }, (err, exists) => {
                if (err)
                    reject(err);
                else {
                    if (!exists.Contents.length && folder !== null) {
                        s3.putObject({ Bucket: bucket, Key: `${folder}/`, Body: '' }, (err, data) => {
                            if (err)
                                reject(err);
                            else
                                resolve(true);
                        });
                    }
                    resolve(false);
                }
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
};