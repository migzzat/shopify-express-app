const port = require("./_config_").App.port;
const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');
/***************************** */

//static file path
app.use(express.static(path.join(__dirname, 'assets/')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


// Add headers
app.use( (req, res, next)=>{

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});      

/* use routes */
app.use("/" , require("./routes/main.route"))
app.use("/shopify" , require("./routes/shopify.route"))
app.use("/script" , require("./routes/script.route"))

/***************************** */
app.listen(port , () => {
    console.log(`server started at ${port}`)
 
    // try{
        //  openBrowsers(`http://localhost:${port}`)
    // }catch(err){}

})