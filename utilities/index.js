const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function (data){
  
  let grid
  if(data.length > 0){
    grid = '<h1>' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model + '</h1>'
    grid += '<div id="detail-display">'
    data.forEach(vehicle => { 
     
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<div class="detailSection">'
      grid += '<h2>'
      grid +=  data[0].inv_make + ' ' + data[0].inv_model  + ' ' + 'Details'
      grid += '</h2>'
       grid += '<span>' + '<strong>Price:</strong>' + ' ' + '$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<span><strong>Description:</strong> ' + vehicle.inv_description + '</span>';
      grid += '<span><strong>Color:</strong> ' + vehicle.inv_color + '</span>';
      grid += '<span><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)   + '</span>';
     grid += '<span><strong>Buy:</strong> ' + '<a href="../../inv/buy/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>' 
      grid += '</div>'
      grid += '</div>'
      
    }) 
  }
  else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the Buy view HTML
* ************************************ */
Util.buildBuyGrid = async function (data){
  
  let grid
  if(data.length > 0){
    grid = '<h1>Buy The ' + data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model + '</h1>'
    grid += '<div id="buy-display">'
    data.forEach(vehicle => { 
     
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<div class="detailSection">'
      grid += '<h2>'
      grid +=  data[0].inv_make + ' ' + data[0].inv_model  + ' ' + 'Details'
      grid += '</h2>'
       grid += '<span>' + '<strong>Price:</strong>' + ' ' + '$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<span><strong>Description:</strong> ' + vehicle.inv_description + '</span>';
      grid += '<span><strong>Color:</strong> ' + vehicle.inv_color + '</span>';
      grid += '<span><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)   + '</span>';

      grid += '</div>'
      grid += '</div>'
      
    }) 
  }
  else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


// management view
Util.buildManagementView = async function () {
  let grid
    
    grid = '<div id="management-view">'
    grid += '<a href="/inv/add-classification">Add New Classification</a>'
    grid += '<a href="/inv/add-inventory">Add New Vehicle</a>'
     grid += '</div>'
      

  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


  /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    res.locals.accountData = null
    res.locals.loggedin = 0
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountData = res.locals.accountData

  if (res.locals.loggedin && (accountData.account_type === "Employee" || accountData.account_type === "Admin")) {
    return next()
  }

  req.flash("notice", "You must be logged in with appropriate permissions to access that area.")
  return res.status(403).redirect("/account/login")
}


 Util.checkClient = (req, res, next) => {
  const accountData = res.locals.accountData

  if (res.locals.loggedin && (accountData.account_type === "Client")) {
    return next()
  }

  req.flash("notice", "You must be logged in.")
  return res.status(403).redirect("/account/login")
}

module.exports = Util