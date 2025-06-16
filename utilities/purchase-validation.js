const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")
const invModel = require("../models/inventory-model")

const validate = {}


validate.purchaseRules = [
  body("prch_contact")
    .notEmpty().withMessage("Contact information is required.")
    .isLength({ min: 5 }).withMessage("Contact info must be at least 5 characters."),

  body("prch_credit")
    .optional({ checkFalsy: true }) // allow empty
    .isNumeric().withMessage("Credit score must be a number.")
    .isLength({ min: 3, max: 3 }).withMessage("Credit score should be 3 digits."),

  body("prch_down_payment")
    .notEmpty().withMessage("Down payment is required.")
    .isFloat({ min: 0 }).withMessage("Down payment must be a valid number."),

  body("prch_time_loan")
    .notEmpty().withMessage("Loan period is required.")
    .isInt({ min: 6, max: 84 }).withMessage("Loan period should be between 6 and 84 months."),

  body("prch_pay_meathod")
    .notEmpty().withMessage("Preferred payment method is required.")
    .isAlpha('en-US', { ignore: " " }).withMessage("Payment method must be letters only."),

  body("prch_trade")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage("Trade-in value must be a number."),

  body("prch_custom")
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage("Add-ons must be under 100 characters."),

  body("inv_id")
    .notEmpty().withMessage("Missing inventory ID.")
    .isInt().withMessage("Invalid inventory ID.")
]

validate.checkPurchaseData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
   
    const data = await invModel.getInventoryByDetailId(req.body.inv_id);
    const grid = await utilities.buildBuyGrid(data);

    return res.status(400).render("purchases/buy", {
      title: "Purchase Request",
      nav,
      errors: errors.array(),
      prch_contact: req.body.prch_contact,
      prch_credit: req.body.prch_credit,
      prch_down_payment: req.body.prch_down_payment,
      prch_time_loan: req.body.prch_time_loan,
      prch_pay_meathod: req.body.prch_pay_meathod,
      prch_trade: req.body.prch_trade,
      prch_custom: req.body.prch_custom,
      inv_id: req.body.inv_id,
      grid, 
      account_id: res.locals.accountData.account_id,
    });
  }

  next();
};
module.exports = validate
