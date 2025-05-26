// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utils = require("../utilities")
const regValidate = require('../utilities/account-validation')



// Route to deliver login view
router.get("/login", utils.handleErrors(accountController.buildLogin));


// Route to deliver register view
router.get("/register", utils.handleErrors(accountController.buildRegister));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utils.handleErrors(accountController.registerAccount)
)

module.exports = router;


