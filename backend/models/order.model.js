
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the "User" model for population
        required: true,
      },
    
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the "Product" model for population
        required: true,
      },
      
      quantity: {
        type: Number,
        default: 1,
      },
    
      address: {
        pincode: { type: String, required: true },
        state: { type: String, required: true }, 
        city: { type: String, required: true }, 
        road_name: { type: String, required: true },
      },

      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "return",
          "returned",
        ],
        default: "pending",
      },
      role: {
        type: String,
        enum: ["customer", "seller", "admin"],
        require: true,
      },
    
      orderDate: {
        type: Date,
        required: true,
      },
});


const OrderModel = mongoose.model("order", orderSchema);


module.exports = OrderModel;