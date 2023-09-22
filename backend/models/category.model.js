
const mongoose = require("mongoose");


const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});


const CategorytModel = mongoose.model("category", categorySchema);

// Create an index on the "category" field to ensure uniqueness and faster queries
categorySchema.index({ category: 1 });



module.exports = CategorytModel;