const ProductModel = require("../models/prodect.model");
const UserModel = require("../models/user.model");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing cart
 */

/**
 * @swagger
 * /cart/items:
 *   get:
 *     summary: Get User's Cart Items
 *     description: Retrieve the items in the user's cart.
 *     tags: [Cart]
 *     responses:
 *       '200':
 *         description: Successfully retrieved the user's cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: ID of the product in the cart
 *                   quantity:
 *                     type: number
 *                     description: Quantity of the product in the cart
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

exports.cartItems=async (req, res) => {
    // Extract the userID from the request body (previously set in the Authentication middleware)
    const userID = req.body.userID;
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 404 Not Found status with an error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Get the user's cart from the user object
      const cart = user.cart;
  
      // Send the cart data as a response with a 200 OK status
      res.status(200).send(cart);
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  }

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing cart
 */

/**
 * @swagger
 * paths:
 *   /cart/add:
 *     post:
 *       summary: Add Product to User's Cart
 *       description: Add a product to the user's cart.
 *       tags: [Cart]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                   description: ID of the product to add to the cart.
 *                 quantity:
 *                   type: number
 *                   default: 1 
 *                   description: Quantity of the product to add to the cart.
 *       responses:
 *         '200':
 *           description: Product added to the cart successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '404':
 *           description: User not found or Product is not available
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '409':
 *           description: Product already in the cart
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */


  exports.addtoCart=async (req, res) => {
    // Extract the productId, quantity (default is 1), and userID from the request body
    const { productId, quantity = 1 } = req.body;
    const userID=req.body.userID
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 404 Not Found status with an error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Find the product with the provided productId that is currently available
      const product = await ProductModel.findOne({
        _id: productId,
        availability: true,
      });
  
      // If the product is not found or is not available, return a 404 Not Found status with an error message
      if (!product) {
        return res.status(404).send({ message: "Product is not available" });
      }
  
      // Check if the product is already present in the user's cart (by comparing productId)
      if (user.cart.some((index) => index.productId.toString() === productId)) {
        return res.status(409).send({ message: "Product already in cart" });
      }
  
      // If the product is not already in the cart, add it to the user's cart using $push operation
      await UserModel.findOneAndUpdate(
        { _id: userID },
        {
          $push: {
            cart: {
              productId,
              quantity,
            },
          },
        }
      );
  
      // Return a success message with a 200 OK status
      res.send({ message: "Product added to cart" });
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  }

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing cart
 */

/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove Product from User's Cart
 *     description: Remove a product from the user's cart by its ID.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to remove from the cart
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         description: ID of the user whose cart to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       '200':
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Product not found in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '501':
 *         description: Not Implemented - An error occurred during removal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.removeCart=async (req, res) => {
    // Extract the productId from the URL parameter
    const productId = req.params.id;
  
    // Extract the userId from the request body
    const { userId } = req.body;
  
    // Find the user with the provided userId
    const user = await UserModel.findOne({ _id: userId });
  
    // Retrieve the user's cart
    const cart = user.cart;
  
    // Check if the product is in the user's cart
    if (cart.some((index) => index.productId.toString() === productId)) {
      try {
        // If the product is in the cart, remove it from the cart using $pull operation
        await UserModel.findOneAndUpdate(
          { _id: userId },
          {
            $pull: { cart: { productId } },
          }
        );
  
        // Return a success message with a 200 OK status
        res
          .status(200)
          .send({ message: `Product with ID ${productId} removed from cart` });
      } catch (error) {
        // If any error occurs during processing, return a 501 Not Implemented status with an error message
        return res.status(501).send({ message: error.message });
      }
    } else {
      // If the product is not in the cart, return a 404 Not Found status with an error message
      return res.status(404).send({ message: "Product not found in cart" });
    }
  }


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing cart
 */

/**
 * @swagger
 * /cart/increase/{id}:
 *   patch:
 *     summary: Increase Quantity of Product in User's Cart
 *     description: Increase the quantity of a product in the user's cart by its ID (up to a maximum of 1).
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to increase quantity in the cart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Quantity increased for the product in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Product not found in cart or Quantity cannot be increased 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '501':
 *         description: Not Implemented - An error occurred during quantity increase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.increaseCart=async (req, res) => {
    // Extract the productId from the URL parameter
    const productId = req.params.id;
  
    // Extract the userID from the request body
    const { userID } = req.body;
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 404 Not Found status with an error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Retrieve the user's cart
      const cart = user.cart;
  
      // Find the item in the cart with the provided productId
      const foundItem = cart.find(
        (item) => item.productId.toString() === productId
      );
  
      if (foundItem) {
        // If the item is found and the quantity is less than 10, increase the quantity by 1 and save the user
        if (foundItem.quantity < 10) {
          foundItem.quantity++;
          await user.save();
          return res.status(200).send({
            message: `Quantity updated for product with ID ${productId}`,
          });
        } else {
          // If the quantity is already 10, return a 404 Not Found status with an error message
          return res
            .status(404)
            .send({ message: "You Cannot add more than 10 items" });
        }
      } else {
        // If the item is not found in the cart, return a 404 Not Found status with an error message
        return res.status(404).send({ message: "Product not found in cart" });
      }
    } catch (error) {
      // If any error occurs during processing, return a 501 Not Implemented status with an error message
      return res.status(501).send({ message: error.message });
    }
  }

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing cart
 */

/**
 * @swagger
 * /cart/decrease/{id}:
 *   patch:
 *     summary: Decrease Quantity of Product in User's Cart
 *     description: Decrease the quantity of a product in the user's cart by its ID (down to a minimum of 1).
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to decrease quantity in the cart
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Quantity decreased for the product in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Product not found in cart or Quantity cannot be decreased below 1
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '501':
 *         description: Not Implemented - An error occurred during quantity decrease
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

  exports.decreseCart=async (req, res) => {
    // Extract the productId from the URL parameter
    const productId = req.params.id;
  
    // Extract the userID from the request body
    const { userID } = req.body;
  
    try {
      // Find the user with the provided userID
      const user = await UserModel.findOne({ _id: userID });
  
      // If the user is not found, return a 404 Not Found status with an error message
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Retrieve the user's cart
      const cart = user.cart;
  
      // Find the item in the cart with the provided productId
      const foundItem = cart.find(
        (item) => item.productId.toString() === productId
      );
  
      if (foundItem) {
        // If the item is found and the quantity is greater than 1, decrease the quantity by 1 and save the user
        if (foundItem.quantity > 1) {
          foundItem.quantity--;
          await user.save();
          return res.status(200).send({
            message: `Quantity updated for product with ID ${productId}`,
          });
        } else {
          // If the quantity is already 1, return a 404 Not Found status with an error message
          return res
            .status(404)
            .send({ message: "You cannot decrease less than one item." });
        }
      } else {
        // If the item is not found in the cart, return a 404 Not Found status with an error message
        return res.status(404).send({ message: "Product not found in cart" });
      }
    } catch (error) {
      // If any error occurs during processing, return a 501 Not Implemented status with an error message
      return res.status(501).send({ message: error.message });
    }
  }