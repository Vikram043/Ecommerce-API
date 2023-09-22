const CategorytModel = require("../models/category.model");
const ProductModel = require("../models/prodect.model");



exports.addProduct=async (req, res) => {
    const { title, price, description, availability, categoryId, images } =
      req.body;
  
    try {
      if (
        !title ||
        !price ||
        !description ||
        !availability ||
        !categoryId ||
        !images
      ) {
        return res.status(404).send({ message: "Please Provide All Details" });
      }
  
      const findCategory = await CategorytModel.findOne({ _id: categoryId });
  
      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
  
      const product = new ProductModel({
        title,
        price,
        description,
        availability,
        categoryId,
        images,
      });
  
      await product.save();
  
      res.status(201).send({ message: "Product added successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
exports.category=async (req, res) => {
    const categoryId = req.params.categoryId;
  
    try {
      const findCategory = await CategorytModel.findOne({ _id: categoryId });
  
      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
  
      const products = await ProductModel.find({ categoryId });
  
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


exports.product=async (req, res) => {
    const id = req.params.id;
  
    try {
      const product = await ProductModel.findOne({ _id: id });
  
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

exports.productUpdate=async (req, res) => {
    const id = req.params.id;
  
    const payload = req.body;
  
    try {
      const product = await ProductModel.findOne({ _id: id });
  
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      if (payload.categoryId) {
        const findCategory = await CategorytModel.findOne({
          _id: payload.categoryId,
        });
  
        if (!findCategory) {
          return res.status(404).send({ message: "Category not found" });
        }
      }
  
      await ProductModel.findByIdAndUpdate({ _id: id }, payload);
  
      res.status(200).send({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }







exports.productDelete=async (req, res) => {
    // Extract the product ID from the URL parameter
    const id = req.params.id;
  
    try {
      const product = await ProductModel.findOne({ _id: id });
  
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
  
      await ProductModel.delete({ _id: id });
  
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };