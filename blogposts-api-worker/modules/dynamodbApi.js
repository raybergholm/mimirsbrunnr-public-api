const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-1"
});

const dynamoDB = new AWS.DynamoDB();

const BLOG_POST_CATALOGUE_TABLE_NAME = process.env.BLOG_POST_CATALOGUE_TABLE_NAME;

module.exports = {

};