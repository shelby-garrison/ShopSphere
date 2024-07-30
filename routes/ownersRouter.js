const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

router.get("/create", (req,res) =>{

  res.render('owner-login')
})

router.get("/products", (req,res) =>{
 let success = req.flash("success")
  res.render('createproducts', {success})
})

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();
    if (owners) {
      // res.render('demo')
      return res
        .status(500)
        .send("You don't have permission to create a new owner.");
    }
   else{
    let { fullname, email, password } = req.body;

    let createdOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    createdOwner.save();

    res.status(201).send(createdOwner);
   }
   
  });
}


module.exports = router;