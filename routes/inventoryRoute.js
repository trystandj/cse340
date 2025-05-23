// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build detail page by inv_id view
router.get("/detail/:detailId", invController.buildByDetailId); 

module.exports = router;
