const dynamodbApi = require("./dynamodbApi");
const s3Api = require("./s3Api");

const REQUEST_TYPE = {
    SinglePost: "/public/blog",
    Page: "/public/blog/page"
};

const BLOG_POSTS_TABLE_NAME = process.env.BLOG_POSTS_TABLE_NAME;
const BLOG_POSTS_BUCKET_NAME = process.env.BLOG_POSTS_BUCKET_NAME;

const dynamodb = dynamodbApi(BLOG_POSTS_TABLE_NAME);
const s3 = s3Api(BLOG_POSTS_BUCKET_NAME);

const buildBlogPost = async (ddbEntry) => await ({
    yearMonthKey: ddbEntry.yearMonthKey.S,
    publishDate: ddbEntry.publishDate.S,
    restUrlKey: ddbEntry.restUrlKey.S,
    author: ddbEntry.author.S,
    title: ddbEntry.title.S,
    body: await s3.getFile(ddbEntry.s3Filename.S),
    tags: ddbEntry.tags.SS
});

const processRequest = async ({ path, pathParameters, queryStringParameters }) => {
    let response;
    switch(path){
        case REQUEST_TYPE.SinglePost:
            response = await fetchPost({...pathParameters, queryStringParameters});
            break;
        case REQUEST_TYPE.Page:
            response = await fetchPage({...pathParameters, queryStringParameters});
            break;
    }

    return response;
};

const fetchPage = async ({yearMonthKey, queryStringParameters}) => {
    if(!yearMonthKey){
        throw new Error("Missing key, could not fetch page");
    }

    const result = await dynamodb.queryTable(yearMonthKey);

    const posts = await Promise.all(result.map((entry) => buildBlogPost(entry)));

    return posts;
};

const fetchPost = async ({post: restUrlKey, queryStringParameters}) => {
    // NOTE: Currently no real way to get a single post out of DDB with the current setup, need to fix that

    console.log("fetchPost incoming queryParams:", queryStringParameters);

    const result = await dynamodb.queryTable({restUrlKey});

    const post = await buildBlogPost(result[0]);

    const comments = await fetchComments({restUrlKey});

    post.comments = comments;

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