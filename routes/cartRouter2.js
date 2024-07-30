const express = require("express");
const router = express.Router();
const isloggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")

router.get("/", isloggedin, async function (req, res) {
    let user = await userModel
    .findOne({email: req.user.email})
    .populate("cart.productid");
     
   res.render('cart', { user });
  
});


router.post('/update/:productId', isloggedin, async(req,res) =>{
    const  {productId}  = req.params;
    const {change}  = req.body;
    
   
    
    try {
        const user = await userModel.findById(req.user._id).populate('cart.productid');
        
        const item = user.cart.find(item => item.productid._id.equals(productId));
       
        
        if (item) {
            item.quantity += change;
         
            if (item.quantity <= 0) {
                
                user.cart = user.cart.filter(item => !item.productid._id.equals(productId));
                
            }
             else {
                item.amount = item.quantity * item.productid.price; // Adjust this based on your pricing logic
                
            }
            await user.save();
            
            const totalAmount = user.cart.reduce((total, item) => total + item.amount, 0);
            
           
            res.status(200).json({ success:true, productId, message: 'Quantity updated successfully', quantity: item.quantity, amount: item.amount, totalAmount });
            
             
        } else {
            
            res.status(404).json({ success: false, message: 'Item not found' });

        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ success: false, message: 'Failed to update quantity', error: error.message });
    }
});


router.post('/add/:id', isloggedin, async (req, res) => {
    try {
        const productId = req.params.id;
        
        const userId = req.user._id; // Assuming user session is managed
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not logged in.' });
        }
  
        // Fetch product details (if needed)
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        const price = product.price;
        
        const user = await userModel.findById(userId);
        
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
      user.cart[i].quantity++;
        user.cart[i].amount= user.cart[i].quantity* price
        
        await user.save();
    }
      else{
        user.cart.push({productid: productId, quantity: 1 , amount: price})
        await user.save();
         
      }
     
        
       
  
        // Respond with success
        res.status(200).json({ success: true, message: 'Product added to cart.' });
  
    }
     catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });

  
 router.get("/remove/:prodid", isloggedin, async function (req, res) {

    let user = await userModel.findOne({email : req.user.email}) 
    let id = req.params.prodid;
    
    let product = await productModel.findOne({_id :id})
    let price  = product.price;
   
  
  let i=0;
  let flag=0;
    for(i=0; i<user.cart.length; i++)
    {
      if(user.cart[i].productid == id)
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
    });

module.exports = router;
