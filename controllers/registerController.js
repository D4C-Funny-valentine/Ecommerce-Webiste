const User = require("../model/User");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      res
        .status(400)
        .json({ message: "Username, email and password are required" });
    } else {
      // check email validation
      const validEmail = validator.validate(email);
      if (validEmail) {
        // encrypt password
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
          username: username,
          email: email,
          password: hashPassword,
        });

        return res.status(201).json({
          success: true,
          message: `New user ${username} is registered successfully.`,
        });
      }
      return res.status(400).json({ message: "Email is not valid" });
    }
  } catch (error) {
    res.status(500).json({"message": error?.keyValue?.email ? `This email is already taken` : `This name is already taken`});
  }
};

module.exports = { registerHandler };
