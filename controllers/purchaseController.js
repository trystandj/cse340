const purchModel = require("../models/purchase-model")
const utilities = require("../utilities/")


const purchCont = {}

purchCont.buildBuyPageDetailId = async function (req, res, next) {
  const inv_id = req.params.detailId
  
  const data = await purchModel.getInventoryByDetailId(inv_id)
  const grid = await utilities.buildBuyGrid(data)
  const nav = await utilities.getNav()

  res.render("./purchases/buy", {
  title: "Purchase Request",
  nav,
  errors: null,
  grid,
  inv_id,
  account_id: res.locals.accountData.account_id,
  prch_contact: "",
  prch_credit: "",
  prch_down_payment: "",
  prch_time_loan: "",
  prch_pay_meathod: "",
  prch_trade: "",
  prch_custom: ""
})
}


purchCont.savePurchases = async function (req, res, next) {
  const nav = await utilities.getNav()
  const {
    prch_contact,
    prch_credit,
    prch_down_payment,
    prch_time_loan,
    prch_pay_meathod,
    prch_trade,
    prch_custom,
    inv_id
  } = req.body
  const account_id = res.locals.accountData.account_id

  if (!account_id) {
    req.flash("error", "You must be logged in to make a purchase.")
    return res.redirect("/login")
  }

  try {

    const data = await purchModel.getInventoryByDetailId(inv_id)
    const grid = await utilities.buildBuyGrid(data)


    const result = await purchModel.savePurchase(
      prch_contact,
      prch_credit,
      prch_down_payment,
      prch_time_loan,
      prch_pay_meathod,
      prch_trade,
      prch_custom,
      inv_id,
      account_id
    )

    if (result) {
      req.flash("success", "Purchase request submitted successfully.")
      return res.redirect("/inv/management")
    } else {
      throw new Error("Purchase save failed")
    }
  } catch (error) {
    console.error(error)

    const data = await purchModel.getInventoryByDetailId(req.body.inv_id)
    const grid = await utilities.buildBuyGrid(data)

    res.status(500).render("purchases/buy", {
      title: "Purchase Request",
      nav,
      errors: [error.message], 
      grid,
      prch_contact: req.body.prch_contact,
      prch_credit: req.body.prch_credit,
      prch_down_payment: req.body.prch_down_payment,
      prch_time_loan: req.body.prch_time_loan,
      prch_pay_meathod: req.body.prch_pay_meathod,
      prch_trade: req.body.prch_trade,
      prch_custom: req.body.prch_custom,
      inv_id: req.body.inv_id,
      account_id,
    })
  }
}




purchCont.buildPurchaseRequestsByAccount = async function (req, res, next) {
  try {

    const purchaseData = await purchModel.getPurchasesWithInventoryAndAccount(); 

    const grid = await utilities.buildPurchaseRequestGrid(purchaseData);
    const nav = await utilities.getNav();

    res.render("purchases/purchases", {
      title: "All Purchase Requests",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};




module.exports = purchCont
