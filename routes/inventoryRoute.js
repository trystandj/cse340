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


// Route to Edit Purchase page by inv_id view

router.get('/purchases', utils.checkEmployeeOrAdmin,  utils.handleErrors(invController.buildPurchaseRequestsByAccount))

// error trigger 500
router.get("/error-test", utils.handleErrors(invController.triggerError));

// Route to build management view
router.get("/management", utils.checkEmployeeOrAdmin, utils.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utils.checkEmployeeOrAdmin, utils.handleErrors(invController.buildAddClassification));

// Route to add classification
router.get("/getInventory/:classification_id", utils.checkEmployeeOrAdmin, utils.handleErrors(invController.getInventoryJSON))

// route to edit inventory
router.get("/edit/:inv_id", utils.checkEmployeeOrAdmin, utils.handleErrors(invController.buildEditInventory));

// delete route
router.get("/delete/:inv_id", utils.checkEmployeeOrAdmin, utils.handleErrors(invController.deleteView))

// update inventory
router.post("/update/", regValidate.inventoryRules(), utils.checkEmployeeOrAdmin, regValidate.checkUpdateData, utils.handleErrors(invController.updateInventory))

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



// Route to add view
router.post(
  "/buy",
  regValidate.purchaseRules,
  regValidate.checkPurchaseData,
  utils.handleErrors(invController.savePurchases)
);

// Route to buy detail page by inv_id view
router.get("/buy/:detailId",utils.checkLogin, utils.handleErrors(invController.buildBuyPageDetailId)); 



// Route to add view
router.post(
  "/edit-purchase",
  regValidate.purchaseRules,
  regValidate.checkPurchaseData,
  utils.handleErrors(invController.savePurchases)
);

router.post(
  "/delete",

  utils.handleErrors(invController.deleteItem)
);



module.exports = router;


