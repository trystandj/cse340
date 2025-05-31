const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const validate = {}

validate.registrationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Classification Name must contain only letters."),
  ]
}

validate.checkRegistrationData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    })
  }

  next()
}



validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ max: 50 })
      .withMessage("Make must be less than 50 characters."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ max: 50 })
      .withMessage("Model must be less than 50 characters."),
    body("inv_year")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Year must be a number.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image URL is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail URL is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number and cannot contain commas."),
    body("classification_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Classification ID is required and must be a number."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: errors.array(),
      classificationList,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    })
  }

  next()
}


module.exports = validate
