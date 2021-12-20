global.constants = {
    api_root_url: "http://localhost:8000"
    // api_root_url: "http://mentorme.dpsi.jp/api"
};

global.amplify = {
    s3: {
        REGION: "YOUR_S3_UPLOADS_BUCKET_REGION",
        BUCKET: "YOUR_S3_UPLOADS_BUCKET_NAME"
    },
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://m4ghmih179.execute-api.us-east-1.amazonaws.com/dev"
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_JoBhijoA9",
        APP_CLIENT_ID: "1aisbe71h3f65rmioottj1knvb",
        IDENTITY_POOL_ID: "YOUR_IDENTITY_POOL_ID"
    }
}
