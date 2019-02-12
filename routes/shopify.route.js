const express = require("express"),
      router = express.Router(),
      shopifyCtrl = require("../controllers/shopify.contoller");

/*********************** */
/* /shopify */
router.get("/install" , (req , res , next) => {
  shopifyCtrl.install(req , res)
})

router.get("/callback" , (req , res , next) => {
  shopifyCtrl.callback(req , res)
})


router.get("/scripttag/add" , (req , res , next) => {
  shopifyCtrl.addScript(req , res)
})

/*************** */
module.exports = router