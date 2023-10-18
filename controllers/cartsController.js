const Cart = require("../model/Cart");

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    if (!carts) {
      return res.status(404).json({ message: "No cart data" });
    }
    return res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createCartHandler = async (req, res) => {
  try {
    const newCart = await Cart.create(req.body);
    return res.status(200).json(newCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateCartHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(201).json(updateCart);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteCartHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting cart",
    });
  }
};

const getUserCart = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).status({ message: "Id parameter is required" });
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    if (!cart) {
      return res
        .status(204)
        .json({ message: "Cart with the given ID not found" });
    } else {
      return res.status(200).json(cart);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while getting for single cart",
    });
  }
};

module.exports = {
  getAllCarts,
  createCartHandler,
  updateCartHandler,
  deleteCartHandler,
  getUserCart,
};
