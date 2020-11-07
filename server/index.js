if (process.env.NODE_ENV !== "production") {
  const result = require("dotenv").config();
  if (result.error) {
    throw result.error;
  }
}

const app = require("express")();
const mongoose = require("mongoose");

app.use(require("morgan")("dev"));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => {
    throw error;
  });

app.use("/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
