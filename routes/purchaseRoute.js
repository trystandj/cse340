// Needed Resources 
const express = require("express")
const router = new express.Router() 
const purchaseModel = require("../controllers/purchaseController")
const utils = require("../utilities")
const regValidate = require('../utilities/purchase-validation')




// Route to Edit Purchase page by inv_id view

router.get('/purchases', utils.checkEmployeeOrAdmin,  utils.handleErrors(purchaseModel.buildPurchaseRequestsByAccount))


// Route to add view
router.post(
  "/buy",
  regValidate.purchaseRules,
  regValidate.checkPurchaseData,
  utils.handleErrors(purchaseModel.savePurchases)
);

// Route to buy detail page by inv_id view
router.get("/buy/:detailId",utils.checkLogin, utils.handleErrors(purchaseModel.buildBuyPageDetailId)); 



// Route to add view
router.post(
  "/edit-purchase",
  regValidate.purchaseRules,
  regValidate.checkPurchaseData,
  utils.handleErrors(purchaseModel.savePurchases)
);

module.exports = router;