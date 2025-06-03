// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utils = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/", utils.checkLogin, utils.handleErrors(accountController.buildAccount))

// Route to deliver login view
router.get("/login", utils.handleErrors(accountController.buildLogin));


// Route to deliver register view
router.get("/register", utils.handleErrors(accountController.buildRegister));

router.get("/account", utils.handleErrors(accountController.buildAccount))


router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utils.handleErrors(accountController.registerAccount)
)

// Process the login attempt
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  utils.handleErrors(accountController.accountLogin)
)

module.exports = router;


