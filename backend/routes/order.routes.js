// Import required modules
const express = require("express");
const { orders, order, allOrders, addOrder, updateOrder, removeOrder } = require("../controllers/order.controller");
const { Authentication } = require("../Middleware/authentication.middleware");

// Create an Express router instance
const OrdersRouter = express.Router();

// Apply the Authentication middleware to protect routes
OrdersRouter.use(Authentication);


OrdersRouter.get("/",allOrders);

OrdersRouter.get("/details/:id",order );

OrdersRouter.post("/place/:productId", addOrder);

OrdersRouter.patch("/return/:orderId", updateOrder);

OrdersRouter.delete("/cancel/:orderId", removeOrder);

// Export the OrdersRouter so that it can be used in other parts of the application
module.exports = {
  OrdersRouter,
};