
const express = require("express");
const { addCategory, updateCategory, removeCategory, allCategory } = require("../controllers/category.controller");
const CategoryRouter = express.Router();


CategoryRouter.post("/add", addCategory);

CategoryRouter.get("/all",allCategory );

CategoryRouter.patch("/update/:id", updateCategory);

CategoryRouter.delete("/remove/:id", removeCategory);


// Export the CategoryRouter so that it can be used in other parts of the application
module.exports = { CategoryRouter };