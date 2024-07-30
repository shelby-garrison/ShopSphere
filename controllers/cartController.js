const userModel = require('../models/user-model'); // Adjust the path to your User model
const isloggedin = require("../middlewares/isLoggedIn");

const updateCartQuantity = async function(req, res) {
    const  {productId}  = req.params;
    const {change}  = req.body;
    
   
    
    try {
        const user = await userModel.findById(req.user._id).populate('cart.productid');
        
        const item = user.cart.find(item => item.productid._id.equals(productId));
       
        
        if (item) {
            item.quantity += change;
         
            if (item.quantity <= 0) {
                // Remove the item if the quantity goes to 0 or less
                user.cart = user.cart.filter(item => !item.productid._id.equals(productId));
            }
             else {
                item.amount = item.quantity * item.productid.price; // Adjust this based on your pricing logic
                
            }
            await user.save();
            
            const totalAmount = user.cart.reduce((total, item) => total + item.amount, 0);
            
           
            res.status(200).json({ productId, quantity: item.quantity, amount: item.amount, totalAmount });
            
             
        } else {
            
            res.status(404).send('Item not found');
        }
    } catch (error) {
        
        console.error('Error updating quantity:', error);
        res.status(500).send('Failed to update quantity');
    }
};

module.exports = { updateCartQuantity };
