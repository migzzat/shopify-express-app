require ('custom-env').env('config')

/************************************* */
module.exports = {
    App : {
        port : process.env.PORT
    },
    MySQL : {
        user     : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        host     : process.env.DB_HOST,
        port     : process.env.DB_PORT
    },
    Shopify : {
        apiKey        : process.env.SHOPIFY_API_KEY,
        apiSecret     : process.env.SHOPIFY_API_SECRET_KEY,
        appStoreToken : "" , //process.env.APP_STORE_TOKEN_TEST,
        scopes        : process.env.SCOPES , 
        host          : process.env.HOST,
        host2         : process.env.SECOND_SERVICE_HOST,
        scriptName    : process.env.SCRIPT_NAME
    }
}