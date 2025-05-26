
const utilities = require("../utilities/")

const accountController = {}


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

// Export the controller functions
accountController.buildLogin = buildLogin
accountController.buildRegister = buildRegister

module.exports = { buildLogin, buildRegister }