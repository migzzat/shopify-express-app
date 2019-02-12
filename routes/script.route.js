const express = require("express"),
      router = express.Router(),
      scriptCtrl = require("../controllers/script.contoller");

/*********************** */
/* /shopify */
router.get("/:filename" , (req , res , next) => {
    scriptCtrl.show(req , res)
})

/*************** */
module.exports = router