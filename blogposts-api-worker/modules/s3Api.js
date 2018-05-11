const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-1"
});

const s3 = new AWS.S3();

const BLOG_POSTS_BUCKET_NAME = process.env.BLOG_POSTS_BUCKET_NAME;

module.exports = {

};