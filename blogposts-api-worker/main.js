const { processRequest } = require("./modules/worker");

const generateHttpResponse = (statusCode, payload) => {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        body: typeof payload === "string" ? payload : JSON.stringify(payload)
    };
};

exports.handler = async (event, context, callback) => {
    // TODO implement

    console.log(event);

    const result = await processRequest(event);

    return generateHttpResponse(200);
};