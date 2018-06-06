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

const queryTable = async (tableName, { keyName, keyValue, publishDate }) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: `${keyName} = :keyValue`,
        ExpressionAttributeValues: {
            ":keyValue": {
                S: `${keyValue}`
            }
        }
    };
    const dynamodbRequest = dynamodb.query(params);

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
    scanTable: async (limit) => await scanTable(tableName, limit),
    queryTable: async (queryParams) => await queryTable(tableName, queryParams)
});

module.exports = dynamodbApi;