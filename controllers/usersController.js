const User = require("../model/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const search = req.query.search;
  const limit = req.query.limit;

  try {
    let users;
    if (search) {
      // filter users by username if search query is provided
      users = (await User.find()).filter((item) =>
        item.username.toLowerCase().includes(search.toLowerCase())
      );

      if (users?.length === 0) {
        return res
          .status(404)
          .json({ message: `No users found for search query: '${search}'` });
      }
    } else {
      // if no query search data get all user first and then
      users = await User.find();

      // ** check if the limit is provided **
      if (limit) {
        // limit the number of the user if 'limit' query is under 30
        const maxLimits = 30;

        // slice the number of user from the get all users array
        const limitedUser =
          limit < maxLimits ? users.slice(0, limit) : users.slice(0, maxLimits);
        users = limitedUser;
      }
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUserHandler = async (req, res) => {
  try {
    if (req.body?.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(201).json(updateUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Successfully deleted." });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// user station per month
const userAggregate = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserHandler,
  deleteUserHandler,
  getUser,
  userAggregate,
};