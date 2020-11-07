const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (!req.header("authorization"))
      throw Error("authentication token not provided");
    token = req.header("authorization").replace("Bearer ", "");
    if (!token) throw Error("authentication token not provided");
    const { user_id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!user_id) {
      throw Error("Invalid token");
    }
    const user = await User.findOne({ _id: user_id, tokens: token });
    if (!user) {
      throw Error("Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send({ error: error.message });
  }
};
