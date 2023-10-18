const Order = require("../model/Order");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(404).json({ message: "No order data found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createOrderHandler = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    return res.status(200).json(newOrder);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateOrderHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(201).json(updateOrder);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteOrderHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting order",
    });
  }
};

const getUserOrder = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).status({ message: "Id parameter is required" });
  try {
    const orders = await Order.find({ userId: req.params.id });
    if (!orders) {
      return res
        .status(204)
        .json({ message: "Order with the given ID not found" });
    } else {
      return res.status(200).json(orders);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while getting for single order",
    });
  }
};

// order income monthly

const orderIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(200).json(income);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getAllOrders,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
  getUserOrder,
  orderIncome
};
