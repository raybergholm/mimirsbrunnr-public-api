const dynamodbApi = require("./dynamodbApi");
const s3Api = require("./s3Api");

const BLOG_POST_CATALOGUE_TABLE_NAME = process.env.BLOG_POST_CATALOGUE_TABLE_NAME;
const BLOG_POSTS_BUCKET_NAME = process.env.BLOG_POSTS_BUCKET_NAME;

const dynamodb = dynamodbApi(BLOG_POST_CATALOGUE_TABLE_NAME);
const s3 = s3Api(BLOG_POSTS_BUCKET_NAME);

const processRequest = ({ path, pathParameters, queryStringParameters }) => {
    if (pathParameters) {
        // fetch a specific post
        return fetchPost(pathParameters.post);
    }else {
        // list all posts
        return listPosts(queryStringParameters);
    }
};

const fetchPost = (postId) => {
    // fetch dynamodb entry for metadata & s3 link

    // fetch from S3 to get the body

    // also fetch related comments

    // concat the two into one object and return it
};

const listPosts = ({ dateRange, tagFilter, searchValue }) => {
    // fetch dynamodb entries

    // for each entry, fetch from S3 to get their blogpost bodies

    // skip comments, not needed for the feed!

    // concat into an array of objects and return it
};

const fetchComments = (postId) => {

};

module.exports = {
    processRequest
};