const express = require("express");
const { cartItems, addtoCart, removeCart, increaseCart, decreseCart } = require("../controllers/cart.controllers");
const { Authentication } = require("../Middleware/authentication.middleware");
const CartRouter = express.Router();



// Apply the Authentication middleware to all routes in this router
CartRouter.use(Authentication);

CartRouter.get("/", cartItems);

CartRouter.post("/add", addtoCart);

CartRouter.delete("/remove/:id", removeCart);

CartRouter.patch("/increase/:id",increaseCart );

CartRouter.patch("/decrease/:id",decreseCart );

// Export the CartRouter so that it can be used
module.exports = {
  CartRouter,
};