// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utils = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utils.handleErrors(invController.buildByClassificationId));
// Route to build detail page by inv_id view
router.get("/detail/:detailId", utils.handleErrors(invController.buildByDetailId)); 

// error trigger 500
router.get("/error-test", utils.handleErrors(invController.triggerError));

module.exports = router;


