const { updateMetadataFiles } = require("./modules/worker");

const generateHttpResponse = (statusCode, payload) => {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: typeof payload === "string" ? payload : JSON.stringify(payload)
    };
};

exports.handler = async (event, context, callback) => {
    console.log(event);

    let response;

    try {
        const result = await updateMetadataFiles();
        response = generateHttpResponse(200, result);
        callback(null, response);
    } catch (error) {
        response = generateHttpResponse(500, error);
        callback(error, response);
    }

};