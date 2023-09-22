const OrderModel = require("../models/order.model");
const UserModel  = require("../models/user.model");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/all:
 *   get:
 *     summary: Get All Orders for a User
 *     description: Retrieve all orders for a user, sorted by order date in descending order.
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time of the order
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


exports.allOrders=async (req, res) => {
    // Extract the userID from the request body
    const { userID } = req.body;
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 404 Not Found status with an error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Retrieve all orders for the user, sorted by orderDate in descending order
      const orders = await OrderModel.find({ userID }).sort({ orderDate: -1 });
  
      // Return the orders as a response with a 200 OK status
      return res.send(orders);
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  }


  /**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/details/{id}:
 *   get:
 *     summary: Get Order Details by ID
 *     description: Retrieve the details of an order by its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the order to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.order=async (req, res) => {
    // Extract the order ID from the URL parameter
    const id = req.params.id;
  
    try {
      // Find the order with the provided ID
      const order = await OrderModel.findOne({ _id: id });
  
      // If the order is not found, return a 404 Not Found status with an error message
      if (!order) {
        return res.status(404).send({ message: "No such order found" });
      }
  
      // Return the order details as a response with a 200 OK status
      res.status(200).send(order);
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  }


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/add/{productId}:
 *   post:
 *     summary: Place an Order
 *     description: Place an order for a product in the user's cart. The product will be removed from the user's cart, and the order will be associated with the selected address.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to place an order for
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pincode:
 *                       type: number
 *                     state:
 *                       type: string
 *                     city:
 *                       type: string
 *                     road_name:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Order Placed Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Please select an address before placing the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Product not found in user cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */



  exports.addOrder=async (req, res) => {
    // Extract the productId from the URL parameter
    const productId = req.params.productId;
  
    // Extract the userID from the request body
    const { userID } = req.body;
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 401 Unauthorized status with an error message
      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }
  
      // Find the product in the user's cart with the provided productId
      const productInCart = user.cart.find(
        (item) => item.productId.toString() === productId
      );
  
      // If the product is not found in the user's cart, return a 401 Unauthorized status with an error message
      if (!productInCart) {
        return res
          .status(401)
          .send({ message: "Product not found in user cart" });
      }
  
      // Find the selected address from the user's address list
      const address = req.body.addresses
      console.log(address)

      // If no address is selected, return a 400 Bad Request status with an error message
      if (!address) {
        return res.status(400).send({
          message: "Please select an address before placing the order",
        });
      }
  
      // Create a new OrderModel instance with the order details
      const date = new Date();
      const order = new OrderModel({
        userID: user._id,
        role: "customer",
        productId: productInCart.productId,
        quantity: productInCart.quantity,
        address: address,
        orderDate: date,
      });
  
      // Save the order to the database
      await order.save();
  
      // Remove the product from the user's cart
      await UserModel.findOneAndUpdate(
        { _id: userID },
        {
          $pull: { cart: { productId } },
        }
      );
  
      // Return a success message with a 200 OK status
      res.send({ message: "Order Placed Successfully" });
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  }




  /**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/return/{orderId}:
 *   patch:
 *     summary: Mark Order as Returned by ID
 *     description: Mark an order as returned by its ID. Only orders with status "delivered" can be marked as returned.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         description: ID of the order to mark as returned
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Order Marked as Returned Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Order with status other than "delivered" cannot be marked as returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '501':
 *         description: Not Implemented (Internal Error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.returnOrder=async (req, res) => {
    // Extract the orderId from the URL parameter
    const orderId = req.params.orderId;
  
    try {
      // Find the order with the provided orderId
      const order = await OrderModel.findOne({ _id: orderId });
  
      // If the order is not found, return a 404 Not Found status with an error message
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }
  
      // Check if the order status is "delivered"
      if (order.status !== "delivered") {
        return res.status(400).send({ message: "Order cannot be returned" });
      }
  
      try {
        // Set the order status to "return" and save the updated order
        order.status = "return";
        await order.save();
  
        // Return a success message with a 200 OK status
        res.send({ message: "Order Marked as Returned Successfully" });
      } catch (error) {
        // If any error occurs during processing, return a 500 Internal Server Error status with an error message
        res.status(500).send({ message: error.message });
      }
    } catch (error) {
      // If any error occurs during processing, return a 501 Not Implemented status with an error message
      return res.status(501).send({ message: error.message });
    }
  }



  /**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /orders/cancel/{orderId}:
 *   delete:
 *     summary: Cancel Order by ID
 *     description: Cancel an order by its ID. Orders with status "delivered" or "returned" cannot be cancelled.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         description: ID of the order to cancel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Order Cancelled Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Order with "delivered" or "returned" status cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '501':
 *         description: Not Implemented (Internal Error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.cancelOrder=async (req, res) => {
    // Extract the orderId from the URL parameter
    const orderId = req.params.orderId;
  
    try {
      // Find the order with the provided orderId
      const order = await OrderModel.findOne({ _id: orderId });
  
      // If the order is not found, return a 404 Not Found status with an error message
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }
  
      // Check if the order status is "delivered" or "returned"
      if (
        order.status === "delivered" ||
        order.status === "delivered" ||
        order.status === "returned"
      ) {
        return res.status(400).send({
          message: `${order.status} Order cannot be cancelled`,
        });
      }
  
      try {
        // Set the order status to "cancelled" and save the updated order
        order.status = "cancelled";
        await order.save();
  
        // Return a success message with a 200 OK status
        res.send({ message: "Order Cancelled Successfully" });
      } catch (error) {
        // If any error occurs during processing, return a 500 Internal Server Error status with an error message
        res.status(500).send({ message: error.message });
      }
    } catch (error) {
      // If any error occurs during processing, return a 501 Not Implemented status with an error message
      return res.status(501).send({ message: error.message });
    }
  }