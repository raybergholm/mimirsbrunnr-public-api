const dynamodbApi = require("./dynamodbApi");
const s3Api = require("./s3Api");

const BLOG_POSTS_TABLE_NAME = process.env.BLOG_POSTS_TABLE_NAME;
const BLOG_METADATA_BUCKET_NAME = process.env.BLOG_METADATA_BUCKET_NAME;

const filenames = {
    QuickLinks: process.env.QUICK_LINKS_FILENAME,
    ArchiveLinks: process.env.ARCHIVE_LINKS_FILENAME,
    Tags: process.env.TAGS_FILENAME,
    Config: process.env.INITIAL_CONFIG_FILENAME
};

const updateMetadataFiles = async () => {
    const dynamodb = dynamodbApi(BLOG_POSTS_TABLE_NAME);
    const s3 = s3Api(BLOG_METADATA_BUCKET_NAME);

    const allPosts = dynamodb.scanTable(100);

};

module.exports = {
    updateMetadataFiles
};