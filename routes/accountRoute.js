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

router.get("/update-account", utils.handleErrors(accountController.buildEditAccount))

router.get("/logout", accountController.logout)

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

router.post(
  "/update-account",
  regValidate.updateLoginData(),
  regValidate.checkAccountUpdate,
  utils.handleErrors(accountController.updateUser)
)

router.post(
  "/update-password",
  regValidate.checkPasswordData(),
  regValidate.checkPasswordUpdate,
  utils.handleErrors(accountController.updatePassword)
)

module.exports = router;


