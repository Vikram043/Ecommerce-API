
const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
        name: {
          type: String,
            required: true 
          },                

        phone: {
          type: Number,
          required: true
          },              

        
        email: { 
          type: String,
          required: true
        },

        password: { 
          type: String,
          required: true
          },

        cart: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product", // Reference to the "Product" model for population
              required: true,
            },
            quantity: {
              type: Number,
              default: 1,
            },
          },
        ],

        address: [
          {
            pincode: { type: Number, required: true },
            state: { type: String, required: true }, 
            city: { type: String, required: true }, 
            road_name: { type: String, required: true }, 
            isSelected: { type: Boolean, default: false }, 
          },
        ],

});


const UserModel = mongoose.model("user", userSchema);


userSchema.index({ email: 1, phone: 1 });


module.exports = UserModel;