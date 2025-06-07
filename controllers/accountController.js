const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )



  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/account")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccount(req, res) {
  let nav = await utilities.getNav()
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please log in to view your account.")
    return res.redirect("/account/login")
  }

  try {
    const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.render("account/account", {
      title: "Account",
      nav,
      errors: null,
      accountData, 
    })
  } catch (err) {
    req.flash("notice", "Session expired. Please log in again.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Logout and clear session cookie
 * *************************************** */
async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/account/login")
}

/* ****************************************
 *  Process user info update
 * *************************************** */
async function updateUser(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateUserRow(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("success", "Congratulations, Account has been updated.")
    return res.redirect("/account/account")
  } else {
    req.flash("error", "Sorry, the account update failed.")
    return res.status(501).render("account/account", {
      title: "Account Management",
      nav,
    })
  }
}

/* ****************************************
 *  Process user psw update
 * *************************************** */
async function updatePassword(req, res) {
 const {  account_id, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("message notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }

 const updateResult = await accountModel.updateUserPassword(
  account_id,
  hashedPassword
)

  if (updateResult) {
    req.flash("notice", "Congratulations, Account has been updated.")
    return res.redirect("/account/account")
  } else {
    req.flash("message notice", "Sorry, the account update failed.")
    return res.status(501).render("account/account", {
      title: "Account Management",
      nav,
    })
  }
}


/* ***************************
 *  Build edit account view
 * ************************** */
 async function buildEditAccount(req, res, next) {
  const account_id = res.locals.accountData.account_id
  console.log(account_id)
  let nav = await utilities.getNav()

  try {
    const accountData = await accountModel.getAccountID(account_id)
  console.log(accountData)
    if (!accountData) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }

    res.render("./account/update-account", {
      title: `Edit Account - ${accountData.account_firstname} ${accountData.account_lastname}`,
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })

  } catch (error) {
    console.error("Error building edit account view:", error)
    req.flash("notice", "An error occurred. Please try again.")
    res.redirect("/account/")
  }
}


// Export all functions
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  logout,
  updateUser,
  buildEditAccount,
  updatePassword
}
