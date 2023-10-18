const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }

    //decrypt & check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const { password, ...other } = user._doc;
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ ...other, accessToken }); // use ...other or you will get data like "other : {}"
    } else {
      return res.status(401).json({ message: "Incorrect password." });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginHandler };
// random crypto code generator cmd line: require("crypto").randomBytes(64).toString('hex')