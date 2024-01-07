const orderService = require("../services/order_services");
const axios = require("axios");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const order = await orderService.save(req.body);
    const signature = createSignature(
      `total_amount=${order.amount},transaction_uuid=${order._id},product_code=EPAYTEST`
    );
    const formData = {
      amount: order.amount,
      failure_url: "https://google.com",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5005/esewa/success",
      tax_amount: "0",
      total_amount: order.amount,
      transaction_uuid: order._id,
    };
    res.json({ message: "Order Created Sucessfully", order, formData });
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};



const createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  // Create an HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};
