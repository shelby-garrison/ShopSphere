
const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")



router.get("/", isloggedin, async function (req, res) {
    let user = await userModel
    .findOne({email: req.user.email})
    .populate("cart.productid");
    

    
   res.render('cart2', { user });
  
 });

router.post('/increase/:productId', isloggedin, async (req, res) => {
    const productId = req.params.productId;
    
    const product = await productModel.findById(productId); 
    
    
    
    
    
    try {
        const user = await userModel.findById(req.user._id); 
        console.log('User found:', user);
        
        const item = user.cart.find(item => item.productid.equals(productId));
        console.log('Cart item found:', item);
        
        if (item) {
            item.quantity++;
           
            
            item.amount = item.quantity * product.price; 
            console.log(item.amount);
            await user.save();
            console.log('Cart updated and saved:', user.cart);
            res.redirect("/cart")
        } else {
            console.log('Item not found in cart');
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).send('Failed to update quantity');
    }
});

router.post('/decrease/:productId', isloggedin, async (req, res) => {
  const productId = req.params.productId;
  
  const product = await productModel.findById(productId); 
  
  
  
  
  
  try {
      const user = await userModel.findById(req.user._id); 
      console.log('User found:', user);
      
      const item = user.cart.find(item => item.productid.equals(productId));
      console.log('Cart item found:', item);
      
      if (item) {
          item.quantity--;
         if(item.quantity <= 0) 
         {
  
            let i=0;
           let flag=0;
             for(i=0; i<user.cart.length; i++)
            {
                if(user.cart[i].productid == productId)
                  {
                      flag = 1;
                       break;
        
                     }
             }
    if(flag === 1)
    {
      user.cart.splice(i,1);
        await user.save();
    }
    res.redirect("/cart");

         }
         
          else{
            item.amount = item.quantity * product.price; 
          console.log(item.amount);
          await user.save();
          console.log('Cart updated and saved:', user.cart);
          res.redirect("/cart")
          }
          
      } else {
          console.log('Item not found in cart');
          res.status(404).send('Item not found');
      }
  } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).send('Failed to update quantity');
  }
});


module.exports = router;