const pool = require("../database/")





async function savePurchase(
  prch_contact,
  prch_credit,
  prch_down_payment,
  prch_time_loan,
  prch_pay_meathod,
  prch_trade,
  prch_custom,
  inv_id,
  account_id
) {
  const sql = `
    INSERT INTO public.purchase (
      prch_contact,
      prch_credit,
      prch_down_payment,
      prch_time_loan,
      prch_pay_meathod,
      prch_trade,
      prch_custom,
      inv_id,
      account_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `

  const values = [
    prch_contact,
    prch_credit,
    prch_down_payment,
    prch_time_loan,
    prch_pay_meathod,
    prch_trade,
    prch_custom,
    inv_id,
    account_id
  ]

  try {
    const result = await pool.query(sql, values)
    return result.rows[0]
  } catch (error) {
    console.error("savePurchase error:", error)
    return null
  }
}
async function getPurchasesWithInventoryAndAccount() {
  try {
    const sql = `
      SELECT p.*, 
             i.inv_make, 
             i.inv_model, 
             i.inv_price, 
             i.inv_year, 
             i.inv_color,
             i.inv_image,
             a.account_firstname,
             a.account_lastname,
             a.account_email
      FROM purchase p
      JOIN inventory i ON p.inv_id = i.inv_id
      JOIN account a ON p.account_id = a.account_id
      ORDER BY p.purchase_id DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
}



async function getInventoryByDetailId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
module.exports = { getPurchasesWithInventoryAndAccount, savePurchase, getInventoryByDetailId};