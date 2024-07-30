const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedIn: false});
});


router.get("/shop", isloggedin, async function (req, res) {
let products =  await productModel.find();
  res.render("shop", { products});
});

router.get("/myAccount", isloggedin, async function (req, res) {
 const user = req.user;
    res.render("myAccount", {user});
  });
  


module.exports = router;