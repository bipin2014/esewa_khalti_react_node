const orderService = require("../services/order_services");
const axios = require("axios");
const crypto = require("crypto");
const { callKhalti } = require("./khalti_controller");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getWhere();
    res.json(orders);
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const order = await orderService.save(req.body);
    const signature = this.createSignature(
      `total_amount=${order.amount},transaction_uuid=${order._id},product_code=EPAYTEST`
    );
    if (order.payment_method === "esewa") {
      const formData = {
        amount: order.amount,
        failure_url: "http://localhost:5173",
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: "http://localhost:5005/api/esewa/success",
        tax_amount: "0",
        total_amount: order.amount,
        transaction_uuid: order._id,
      };
      res.json({
        message: "Order Created Sucessfully",
        order,
        payment_method: "esewa",
        formData,
      });
    } else if (order.payment_method === "khalti") {
      const formData = {
        return_url: "http://localhost:5005/api/khalti/callback",
        website_url: "http://localhost:5005",
        amount: order.amount * 100,//paisa
        purchase_order_id: order._id,
        purchase_order_name: "test",
      };

      callKhalti(formData, req, res);
    }
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.updateOrderAfterPayment = async (req, res, next) => {
  try {
    console.log(req.body);
    const order = await orderService.findById(req.transaction_uuid);
    order.status = "paid";
    order.transaction_code = req.transaction_code;

    await orderService.save(order);
    res.redirect("http://localhost:5173");
  } catch (err) {
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q"; //different in production
  // Create an HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};
