const dynamodbApi = require("./dynamodbApi");
const s3Api = require("./s3Api");

const BLOG_POST_CATALOGUE_TABLE_NAME = process.env.BLOG_POST_CATALOGUE_TABLE_NAME;
const BLOG_POSTS_BUCKET_NAME = process.env.BLOG_POSTS_BUCKET_NAME;

const dynamodb = dynamodbApi(BLOG_POST_CATALOGUE_TABLE_NAME);
const s3 = s3Api(BLOG_POSTS_BUCKET_NAME);

const processRequest = async ({ path, pathParameters, queryStringParameters }) => {
    if (pathParameters) {
        // fetch a specific post
        return await fetchPost({
            partitionKey: pathParameters.post
        });
    } else {
        // list all posts
        return await listPosts(queryStringParameters);
    }
};

const buildBlogPost = async (ddbEntry) => await ({
    postId: ddbEntry.postId.S,
    author: ddbEntry.author.S,
    title: ddbEntry.title.S,
    timestamp: ddbEntry.timestamp.S,
    body: await s3.getFile(ddbEntry.s3Filename.S),
    tags: ddbEntry.tags.SS
});

const fetchPost = async (queryParams) => {
    console.log("fetchPost incoming queryParams:", queryParams);

    const result = await dynamodb.queryTable(queryParams);

    const post = buildBlogPost(result[0]);

    const comments = fetchComments(queryParams);

    console.log("fetchPost returned the following post:", post);

    return post;
};

const queryPosts = async (queryParams) => {
    console.log("queryPosts incoming queryParams:", queryParams);

    const result = await dynamodb.queryTable(queryParams);

    console.log("ddb result", result);

    const promises = await result.map(async (entry) => await buildBlogPost(entry));

    const posts = await Promise.all(promises);

    console.log("queryPosts returned the following posts:", posts);

    return posts;
};

const listPosts = async (incoming) => {
    console.log("listPosts incoming queryParams:", incoming);

    // fetch dynamodb entries
    const result = await dynamodb.scanTable(50);

    console.log("ddb result", result);

    const promises = result.map(async (entry) => ({
        postId: entry.postId.S,
        author: entry.author.S,
        title: entry.title.S,
        timestamp: entry.timestamp.S,
        body: await s3.getFile(entry.s3Filename.S),
        tags: entry.tags.SS
    }));

    const posts = await Promise.all(promises);

    console.log("listPosts returned the following posts:", posts);

    return posts;
};

const fetchComments = async (queryParams) => {

    return [];
};

module.exports = {
    processRequest
};