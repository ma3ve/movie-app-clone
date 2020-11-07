const router = new require("express").Router();
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
router.post("/register/", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        error: `user with email ${req.body.email} already exists`,
      });
    }
    user = new User(req.body);
    await user.save();
    const token = await user.getToken();

    return res.status(200).send({
      user,
      token,
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

router.post("/login/", async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password);
    const token = await user.getToken();
    res.send({ token, user });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    res.send({ user: req.user });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
