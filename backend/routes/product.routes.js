const express = require("express");
const { productDelete, productUpdate, product, addProduct, findProduct } = require("../controllers/product.controller");
const ProductRouter = express.Router();

ProductRouter.post("/add", addProduct);
ProductRouter.get("/category/:categoryId", findProduct);
ProductRouter.get("/:id", product);
ProductRouter.patch("/update/:id", productUpdate);
ProductRouter.delete("/delete/:id", productDelete)



// Export the ProductRouter so that it can be used in other parts of the application
module.exports = { ProductRouter };