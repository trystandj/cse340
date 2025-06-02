const invModel = require("../models/inventory-model")
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utils = require("../utilities")
const accountModel = require("../models/account-model")


const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}


  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  validate.loginRules = () => {
    return [
      // email is required and must be valid
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

      // password is required and must not be empty
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("A password is required."),
    ]
  }

  validate.checkLoginData = () => {
    return body("account_email" && "account_password")
        .trim()
        .isEmail("account_email")
        .normalizeEmail("account_email") // refer to validator.js docs
        .notEmpty("account_password")
        .withMessage("A valid email and password is required.")
        .custom(async (account_email, account_passwrod) => {
          const userExists = await accountModel.checkExistingPassword(account_email, account_passwrod)
          if (userExists){
            throw new Error("User exists. Please log in or use different email")
          }
        })
    
  }



  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate