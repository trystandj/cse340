const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* Build detail page by inv_id */
invCont.buildByDetailId = async function (req, res, next) {
  const inv_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/detail", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ********************************
 *  Trigger an error for testing
 * ******************************** */
invCont.triggerError = async function (req, res, next) {
  const inv_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/detail", {
    title: className + " vehicles",
    nav,
    grid,
  })
  throw new Error("This is a test error")
};


// build management view
invCont.buildManagement = async function (req, res, next) {
  const classificationSelect = await utilities.buildClassificationList()
  const grid = await utilities.buildManagementView()
  const flashMessage = req.flash("notice")
  
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    grid,
    classificationSelect,
    notice: flashMessage
  })
}

// build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process Classification Registration
* *************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body



  console.log("Classification Name:", classification_name) 
  const regResult = await invModel.addClassificationRow(classification_name)
 



  if (regResult) {
  req.flash(
    "success",
    `Congratulations, ${classification_name} has been added.`
  );

  
  res.redirect("/inv/management");  
} else {
  req.flash("errpr", "Sorry, the Classification registration failed.");
  res.status(501).render("inventory/add-classification", {
    title: "Classification Registration",
    nav,
  });
}
}








// build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationList,
  })
}


// process add view
async function addView(req, res) {
  let nav = await utilities.getNav()
  const { inv_model, inv_make, inv_year, inv_description, inv_color, inv_thumbnail, inv_image, inv_miles, inv_price, classification_id } = req.body


  const regResult = await invModel.addViewRow(
    inv_model,
    inv_make,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
 
  if (regResult) {
    req.flash(
      "success",
      `Congratulations, ${inv_model} ${inv_make} has been added.`
    );

  res.redirect("/inv/management");  
} else {
  req.flash("error", "Sorry, the Classification registration failed.");
  res.status(501).render("inventory/add-inventory", {
    title: "Classification Registration",
    nav,
  });
}
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.addView = addView
invCont.addClassification = addClassification
module.exports = invCont


