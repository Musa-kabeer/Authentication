require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET_KEY,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

// app.get("/", async (req, res) => {
//   res.render("home");
// });

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const newUser = await new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) console.log(err);
    res.render("secrets");
  });
});

app.post("/login", async (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) console.log(err);
    if (foundUser) {
      if (foundUser.password === req.body.password) {
        res.render("secrets");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
