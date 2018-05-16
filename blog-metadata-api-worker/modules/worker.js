const s3Api = require("./s3Api");

const BLOG_METADATA_BUCKET_NAME = process.env.BLOG_METADATA_BUCKET_NAME;

const QUICK_LINKS_FILENAME = process.env.QUICK_LINKS_FILENAME;
const ARCHIVE_LINKS_FILENAME = process.env.ARCHIVE_LINKS_FILENAME;
const TAG_LIST_FILENAME = process.env.TAG_LIST_FILENAME;

const s3 = s3Api(BLOG_METADATA_BUCKET_NAME);

const QUICK_LINKS = "quick-links";
const ARCHIVE_LINKS = "archive-links";
const TAG_LIST = "tag-list";

const processRequest = async ({ path }) => {
    const pathTokens = path.split("/");
    const lastToken = pathTokens[pathTokens.length - 1];

    let filename = null;
    switch(lastToken){
        case QUICK_LINKS:
        filename = QUICK_LINKS_FILENAME;
        break;
        case ARCHIVE_LINKS:
        filename = ARCHIVE_LINKS_FILENAME;
        break;
        case TAG_LIST:
        filename = TAG_LIST_FILENAME;
        break;
        default:

    }

    if(filename){
        return await s3.getFile(filename);
    }else {
        return null;
    }
};

module.exports = {
    processRequest
};