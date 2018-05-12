const dynamodbApi = require("./dynamodbApi");
const s3Api = require("./s3Api");

const BLOG_POST_CATALOGUE_TABLE_NAME = process.env.BLOG_POST_CATALOGUE_TABLE_NAME;
const BLOG_POSTS_BUCKET_NAME = process.env.BLOG_POSTS_BUCKET_NAME;

const dynamodb = dynamodbApi(BLOG_POST_CATALOGUE_TABLE_NAME);
const s3 = s3Api(BLOG_POSTS_BUCKET_NAME);

const processRequest = async ({ path, pathParameters, queryStringParameters }) => {
    if (pathParameters) {
        // fetch a specific post
        return await fetchPost(pathParameters.post);
    }else {
        // list all posts
        return await listPosts(queryStringParameters);
    }
};

const fetchPost = async (postId) => {
    // fetch dynamodb entry for metadata & s3 link

    // fetch from S3 to get the body

    // also fetch related comments

    // concat the two into one object and return it
};

const listPosts = async (incoming) => {
    console.log("incoming to listPosts", incoming);

    // fetch dynamodb entries
    const result = await dynamodb.scanTable(50);

    console.log("ddb result", result);

    // for each entry, fetch from S3 to get their blogpost bodies
    const posts = result.map(async (entry) => ({
        postId: entry.postId.S,
        title: entry.title.S,
        body: await s3.getFile(entry.s3Filename.S),
        tags: entry.tags.SS
    }));
    // skip comments, not needed for the feed!

    console.log("final posts", posts);

    // concat into an array of objects and return it
    return posts;
};

const fetchComments = async (postId) => {

};

module.exports = {
    processRequest
};