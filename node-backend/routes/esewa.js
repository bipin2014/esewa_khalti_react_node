var express = require("express");
const { handleEsewaSuccess } = require("../controllers/esewa_controller");
const { updateOrderAfterPayment } = require("../controllers/order_controller");
var router = express.Router();

router.get("/success", handleEsewaSuccess, updateOrderAfterPayment);

module.exports = router;
