const Order = require("../models/order");

exports.save = async (order) => {
  if (order && !order._id) {
    order = new Order(order);
  }
  return await order.save();
};

exports.findById = async (id = {}) => {
  return await Order.findById(id);
};

exports.getCount = async (id = {}) => {
  return await Order.countDocuments();
};

exports.getWhere = async (filter = {}, select, option) => {
  return await Order.find(filter, select, { ...option });
};

exports.updateOne = async (filter = {}, update) => {
  return await Order.findOneAndUpdate(filter, update);
};

exports.delete = async (id) => {
  return await Order.deleteOne({
    _id: id,
  });
};
