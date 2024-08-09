const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const dns = require('dns');

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;

    // Check if full name is valid
    if (fullname.trim().length < 3) {
      req.flash("error", "Please Enter Full Name");
      return res.redirect("/");  
    }
   
    
    function isValidEmail(email, callback) {
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
      if (!emailRegex.test(email)) {
        return callback(false);
      } else {
        // Extract domain and check for MX records
        const domain = email.split('@')[1];
        dns.resolveMx(domain, (err, addresses) => {
         
          if (err || !addresses || addresses.length === 0) {
            return callback(false);
          } else {
            return callback(true);
          }
        });
      }
    }

    // Validate email and handle response
    isValidEmail(email, async (isValid) => {
      if (!isValid) {
        req.flash("error", "Please Enter Valid Email");
        return res.redirect("/"); 
      }
    

      if (password.length <= 8) {
        req.flash("error", "Please Enter A Strong Password ");
        return res.redirect("/");
      }




      // Check if user already exists
      let user = await userModel.findOne({ email: email });
      if (user) {
        req.flash("error", "You already have an account, please login.");
        return res.redirect("/");  
      }

      // Hash password and create new user
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          res.send(err.message);
          return;  
        }
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) {
            res.send(err.message);
            return;  
          } else {
            let user = await userModel.create({
              email,
              password: hash,
              fullname,
            });

            // Generate token and redirect to shop
            let token = generateToken(user);
            res.cookie("token", token);
            return res.redirect("/shop");  
          }
        });
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });

  if (!user) {
    req.flash("error", "Email or Password incorrect");
    return res.redirect("/"); 
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      return res.redirect("/shop"); 
    } else {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/");  
    }
  });
};

module.exports.logout = function (req, res) {
  res.cookie("token", "");
  return res.redirect("/");  
};
