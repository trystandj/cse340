// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utils = require("../utilities")
const regValidate = require('../utilities/data-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utils.handleErrors(invController.buildByClassificationId));
// Route to build detail page by inv_id view
router.get("/detail/:detailId", utils.handleErrors(invController.buildByDetailId)); 

// error trigger 500
router.get("/error-test", utils.handleErrors(invController.triggerError));

// Route to build management view
router.get("/management", utils.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utils.handleErrors(invController.buildAddClassification));


router.post(
  "/add-classification",
  regValidate.registrationRules(),
    regValidate.checkRegistrationData,
  utils.handleErrors(invController.addClassification)
)

// Route to build add view
router.get("/add-inventory", utils.handleErrors(invController.buildAddInventory));

// Route to add view
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utils.handleErrors(invController.addView)
);

module.exports = router;


