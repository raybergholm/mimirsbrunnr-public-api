const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-1"
});

const s3 = new AWS.S3();

const getFile = (bucket, filename) => {
    const s3GetRequest = s3.getObject({
        Bucket: bucket,
        Ket: filename
    });

    return s3GetRequest.promise().then(
        (result) => JSON.parse(result.Body.toString()),
        (err) => {
            console.log("S3 getObject error: ", err);
            return err;
        } 
    );
};

const s3Api = (bucket) => ({
    getFile: (filename) => getFile(bucket, filename)
});

module.exports = s3Api;