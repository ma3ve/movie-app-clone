const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    hidden: Boolean,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokens: [
    {
      type: String,
      required: true,
    },
  ],
});

userSchema.methods.getToken = async function () {
  const token = jwt.sign(
    { user_id: String(this._id) },
    process.env.JWT_SECRET
  );
  await this.update({
    $push: {
      tokens: token,
    },
  });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw Error("user doesnt exists");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw Error("invalid credentials");
  }
  return user;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
