const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-1"
});

const dynamodb = new AWS.DynamoDB();

const scanTable = async (tableName, limit) => {
    const dynamodbRequest = dynamodb.scan({
        TableName: tableName,
        Limit: limit
    });

    return dynamodbRequest.promise().then(
        (result) => {
            return result.Items;
        },
        (err) => {
            console.log("error reading DynamoDB: ", err);
            return err;
        }
    );
};

const dynamodbApi = (tableName) => ({
    scanTable: (limit) => scanTable(tableName, limit)
});

module.exports = dynamodbApi;