const Product = require("../model/Product");

const getAllProducts = async (req, res) => {
  const limit = req.query.limit;
  const search = req.query.search;
  const category = req.query.category;
  try {
    let products;

    // filter products by title if search query is provided
    if (search) {
      products = (await Product.find()).filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );

      if (products?.length === 0) {
        return res
          .status(404)
          .json({ message: `No products found for search query: '${search}'` });
      }
    } else if (category) {
      // filter for the categories if the category query is provided
      products = await Product.find({
        categories: { $in: [category] },
      });
      if (products?.length === 0) {
        return res
          .status(404)
          .json({
            message: `No products found for category query: '${category}'`,
          });
      }
    } else {
      // if no query provided get all the data
      products = await Product.find();

      // limit the number of products if 'limit' query is provided
      if (limit) {
        const maxLimits = 30;
        const limitedProducts =
          limit < maxLimits
            ? products.slice(0, limit)
            : products.slice(0, maxLimits);
        products = limitedProducts;
      }
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while getting for products",
    });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(200).json(newProduct);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateProductHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(201).json(updateProduct);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteProductHandler = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Id parameter is required" });
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while deleting product",
    });
  }
};

const getProduct = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).status({ message: "Id parameter is required" });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(204)
        .json({ message: "Product with the given ID not found" });
    } else {
      return res.status(200).json(product);
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while getting for single product",
    });
  }
};

module.exports = {
  getAllProducts,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProduct,
};