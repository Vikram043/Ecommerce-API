const express = require("express");
const { productDelete, productUpdate, product, addProduct, category } = require("../controllers/product.controller");
const ProductRouter = express.Router();

ProductRouter.post("/add", addProduct);
ProductRouter.get("/category/:categoryId", category);
ProductRouter.get("/:id", product);
ProductRouter.patch("/change/:id", productUpdate);
ProductRouter.delete("/:id", productDelete)



// Export the ProductRouter so that it can be used in other parts of the application
module.exports = { ProductRouter };