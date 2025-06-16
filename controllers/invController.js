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






/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getInventoryByDetailId(inv_id)  // getInventoryByDetailId   getInventoryById
  const itemData = itemDataArray[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}






/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("error", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

invCont.deleteView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const itemData = await invModel.getInventoryByDetailId(inv_id)

  const itemDataArrau = itemData[0]
  console.log(itemData)
  
  const itemName = `${itemDataArrau.inv_make} ${itemDataArrau.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemDataArrau.inv_id,
    inv_make: itemDataArrau.inv_make,
    inv_model: itemDataArrau.inv_model,
    inv_year: itemDataArrau.inv_year,
    inv_price: itemDataArrau.inv_price,
  })
}

invCont.deleteItem = async function (req, res, next) {
  
  
   const { inv_id } = req.body
  console.log(inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  console.log(deleteResult)

  if (deleteResult) {
    req.flash("success", `The item successfully deleted.`)
    res.redirect("/inv/management")
    
  } else {
    req.flash("error", `The item was not deleted.`)
    res.redirect("inventory/delete-confirm")
  } 


  
}



invCont.addView = addView
invCont.addClassification = addClassification

module.exports = invCont


