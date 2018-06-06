const s3Api = require("./s3Api");

const BLOG_METADATA_BUCKET_NAME = process.env.BLOG_METADATA_BUCKET_NAME;

const s3 = s3Api(BLOG_METADATA_BUCKET_NAME);

const filenames = {
    QuickLinks: process.env.QUICK_LINKS_FILENAME,
    ArchiveLinks: process.env.ARCHIVE_LINKS_FILENAME,
    Tags: process.env.TAGS_FILENAME,
    Config: process.env.CONFIG_FILENAME
};

const processRequest = async ({ pathParameters }) => {
    const data = {
        quickLinks: await s3.getFile(filenames.QuickLinks),
        archiveLinks: await s3.getFile(filenames.ArchiveLinks),
        tags: await s3.getFile(filenames.Tags),
        config: await s3.getFile(filenames.Config)
    };

    return data;
};

module.exports = {
    processRequest
};