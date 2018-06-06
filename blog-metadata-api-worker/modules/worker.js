const s3Api = require("./s3Api");

const BLOG_METADATA_BUCKET_NAME = process.env.BLOG_METADATA_BUCKET_NAME;

const s3 = s3Api(BLOG_METADATA_BUCKET_NAME);

const filenames = new Map([
    ["quickLinks", process.env.QUICK_LINKS_FILENAME],
    ["archiveLinks", process.env.ARCHIVE_LINKS_FILENAME],
    ["tags", process.env.TAGS_FILENAME],
    ["config", process.env.CONFIG_FILENAME]
]);

const processRequest = async ({ pathParameters }) => {
    const result = await Promise.all(Array.from(filenames).map(async ([key, filename]) => [key, await s3.getFile(filename)]));

    const response = result.reduce((accumulator, [key, data]) => {
        accumulator[key] = JSON.parse(data);
        return accumulator;
    }, {});

    return response;
};

module.exports = {
    processRequest
};