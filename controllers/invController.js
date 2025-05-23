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

module.exports = invCont;