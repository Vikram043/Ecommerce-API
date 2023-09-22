// Import required modules
const express = require("express");
const { orders, order, allOrders, addOrder, returnOrder, cancelOrder } = require("../controllers/order.controller");
const { Authentication } = require("../middleware/authentication.middlewere");

// Create an Express router instance
const OrdersRouter = express.Router();

// Apply the Authentication middleware to protect routes
OrdersRouter.use(Authentication);


OrdersRouter.get("/all",allOrders);

OrdersRouter.get("/details/:id",order );

OrdersRouter.post("/add/:productId", addOrder);

OrdersRouter.patch("/return/:orderId", returnOrder);

OrdersRouter.delete("/cancel/:orderId", cancelOrder);

// Export the OrdersRouter so that it can be used in other parts of the application
module.exports = {
  OrdersRouter,
};