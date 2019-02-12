const fs = require("fs")

/************** */
module.exports.show = (req , res) => {
    fs.readFile(`./scripts/${require("../_config_").Shopify.scriptName}` , "utf8" , (error , data) => {
        if (error) res.send({error : error});
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(`
        
            var appK = \'${req.query.appK}\';
            var appS = \'${req.query.appS}\';

            console.log("This String From Pushbots Plugin");
            console.log("Your App Key IS => ",appK);
            console.log("Your App Secret IS => ",appS);
        `);
    });
};