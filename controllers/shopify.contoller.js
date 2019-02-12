const config = require("../_config_");

const apiKey = config.Shopify.apiKey;
const apiSecret = config.Shopify.apiSecret;
const appStoreToken = config.Shopify.appStoreToken;
const scopes = config.Shopify.scopes;//scopes="read_products,write_products,read_customers, write_customers,WriteScriptTags"
// Replace this with your HTTPS Forwarding address
const host = config.Shopify.host; 
const host2 = config.Shopify.host2; 
const scriptName = config.Shopify.scriptName;

const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const DB = require("../db/database.db");

/********************* */
class Shopify {

    constructor(){}
    /******************* */
    install(req , res) {
        const shop = req.query.shop;
        if (shop) {
          let state = nonce();
          // console.log(state)
          const redirectUri = host + '/shopify/callback';
          const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
          res.cookie('state', state);
          res.redirect(installUrl);
        } else {
          return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
        }
    }

    /* this callback function handel  */
    callback(req , res) {
        const { shop, hmac, code, state } = req.query;
        console.log("===================================")
        // console.log(req)
        const stateCookie = cookie.parse(req.headers.cookie).state;
      
        if (state != stateCookie) {
          return res.status(403).send(`Request origin cannot be verified ${state} \n ${stateCookie}`);
        }
      
        if (shop && hmac && code) {
          // DONE: Validate request is from Shopify
          const map = Object.assign({}, req.query);
          delete map['signature'];
          delete map['hmac'];
          const message = querystring.stringify(map);
          const providedHmac = Buffer.from(hmac, 'utf-8');
          const generatedHash = Buffer.from(
            crypto
              .createHmac('sha256', apiSecret)
              .update(message)
              .digest('hex'),
              'utf-8'
            );
          let hashEquals = false;
      
          try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
          } catch (e) {
            hashEquals = false;
          };
      
          if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
          }
      
          // DONE: Exchange temporary code for a permanent access token
          const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
          const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
          };
      
          request.post(accessTokenRequestUrl, { json: accessTokenPayload })
          .then((accessTokenResponse) => {
              
            const accessToken = accessTokenResponse.access_token;
            // DONE: Use access token to make API call to 'shop' endpoint
            const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
            const shopRequestHeaders = {
              'X-Shopify-Access-Token': accessToken,
            };
      
            request.get(shopRequestUrl, { headers: shopRequestHeaders })
            .then((shopResponse) => {
                DB.exec(`
                   INSERT INTO \`shops\` 
                    (\`shop_name\`,\`shopify_access_token\`,\`pushbots_app_id\`,\`pushbots_app_secret\` , \`createdAt\` , \`updatedAt\`) 
                   VALUES ('${shop}','${accessToken}','${null}','${null}',NOW(),NOW())
                   ON DUPLICATE KEY UPDATE \`shopify_access_token\`='${accessToken}';
                `, [] ,
                (error , results , fields) => {
                    if(error) throw new Error(error);
                    else if(results.insertId){
                       console.log("done :)")
                       res.status(200).redirect(`${host2}/?shop=${shop}`);
                    }
                });
            })
            .catch((error) => {
              res.status(error.statusCode).send(error.error.error_description);
            });
          })
          .catch((error) => {
            res.status(error.statusCode).send(error.error.error_description);
          });
      
        } else {
          res.status(400).send('Required parameters missing');
        }
    }

   /******************* */
    addScript(req , res) {
        let shop = req.query.shop ;
        console.log(shop);
        if(shop){
            let sqlQeury = "SELECT `shopify_access_token` FROM `shops` WHERE `shop_name` ='"+shop+"'";
            DB.exec(sqlQeury , [] , (error,rows,fields)=>{
                if(error) throw new Error(error)

                let url = 'https://' + shop + '/admin/script_tags.json';
                let script_url = `${host}/reciver?app_access_token=${rows[0]['app_accsess_token']}`;

                request({
                    method: 'POST',
                    uri: url,
                    json: true,
                    headers: {
                        'X-Shopify-Access-Token': rows[0]['shopify_access_token'],
                        'content-type': 'application/json'
                    },
                    body:{
                        script_tag: {
                            event: "onload",
                            src: `${host}/script/${config.Shopify.scriptName}?appK=${req.query.appK}&appS=${req.query.appS}`
                        }
                    }
                }).then( (parsedBody) => {
                    console.log(parsedBody);
                    // res.json(parsedBody);
                    // res.redirect(`https://${shop}/admin/apps`);
                    res.status(201).json({
                        error : '',
                        results : parsedBody
                    });
                })
                .catch( (error) => {
                    console.log(error);
                    // res.json(err);
                    res.status(500).json({
                        error,
                        results : {}
                    });
                });
            });

        }else res.send({error : "Shop Name Empty "});
          
    }
   /******************* */
   updateScript(req , res) {
       let script_tag_id = req.query.id , shop = req.query.shop;

        if(script_tag_id && shop) {

            let url = `https://${shop}/admin/script_tags/${script_tag_id}.json`;
        
            let options = {
                method: 'PUT',
                uri: url,
                json: true,
                headers: {
                    'X-Shopify-Access-Token': appStoreToken,
                    'content-type': 'application/json'
                },
                body:{ 
                    script_tag: {
                    id: script_tag_id,
                    src: `${host}/script/${scriptName}`
                    }
                }
            };
        
            request(options)
                .then(function (parsedBody) {
                    console.log(parsedBody);
                    res.json(parsedBody);
                })
                .catch(function (err) {
                    console.log(err);
                    res.json(err);
                });

        }else res.send({error : "script_id And shop both required"})
   }


}

/********************** */
module.exports = new Shopify()