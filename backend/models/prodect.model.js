const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
      title: {
        type: String,
        required: true,
      },
      
      price: {
        type: Number,
        required: true,
      },
      
      description: {
        type: String,
        required: true,
      },
      
      availability: {
        type: Boolean,
        default: true,
      },
      
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to the "Category" model for population
        required: true,
      },
      
      images: {
        type: [String],
        required: true,
      },
});


const ProductModel = mongoose.model("product", productSchema);

// Create an index on the "categoryId" field to optimize queries related to this field
productSchema.index({ categoryId: 1 });


module.exports = ProductModel;