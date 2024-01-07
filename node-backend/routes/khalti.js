var express = require("express");
const { updateOrderAfterPayment } = require("../controllers/order_controller");
const { handleKhaltiCallback } = require("../controllers/khalti_controller");
var router = express.Router();

router.get("/callback", handleKhaltiCallback, updateOrderAfterPayment);

module.exports = router;
