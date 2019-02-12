const express = require("express"),
      router = express.Router();
const host = require("../_config_").Shopify.host;
/*********************** */

router.get("/" , (req , res , next) => {
  res.render("home", {
    installURL : `${host}/shopify/install?shop=migzz29.myshopify.com`,
    uploadScriptURL : `${host}/shopify/scripttag/add?shop=migzz29.myshopify.com`
  });
})

/*************** */
module.exports = router