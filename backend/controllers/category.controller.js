const CategoryModel = require("../models/category.model");



/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operations related to managing categories
 */

/**
 * @swagger
 * /categories/add:
 *   post:
 *     summary: Add a new category
 *     tags: [Category]
 *     requestBody:
 *       description: Category information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: Name of the category (must be a string).
 *     responses:
 *       201:
 *         description: Category added successfully.
 *       400:
 *         description: Bad request. Please provide the category name.
 *       404:
 *         description: Category must be a string.
 *       500:
 *         description: Internal server error. Please try again later.
 */

module.exports.addCategory = async (req, res) => {
  const category = req.body.category;

  try {
    if (!category) {
      return res
        .status(400)
        .send({ message: "Please provide the category name" });
    }

    if (typeof category !== "string") {
      return res.status(400).send({ message: "Category must be a string" });
    }

    const newCategory = new CategoryModel({
      category: category.toLowerCase(),
    });

    // Save the new category to the database
    await newCategory.save();

    res.status(201).send({ message: "Category added successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Operations related to managing categories
 */

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Category]
 *     description: Retrieve all categories from the CategoryModel
 *     responses:
 *       '200':
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
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

  module.exports.allCategory=async (req, res) => {
    try {
      // Retrieve all categories from the CategoryModel
      const categories = await CategoryModel.find({});
  
      // Return the categories as a response with a 200 OK status
      res.status(200).send(categories);
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      return res.status(500).send({ message: error.message });
    }
  }


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /categories/update/{id}:
 *   patch:
 *     summary: Update a Category
 *     description: Update the name of a category identified by its ID.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated category information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Category not found
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

module.exports.updateCategory = async (req, res) => {
  // Extract the category ID from the URL parameter
  const id = req.params.id;
  
  // Extract the updated category name from the request body
  const category = req.body.category;

  try {
    // Find the category with the provided ID
    const findCategory = await CategoryModel.findOne({ _id: id });

    // If the category is not found, return a 404 Not Found status with an error message
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Check if the updated category is a string
    if (typeof findCategory.category !== "string") {
      return res.status(400).send({ message: "Category must be a string" });
    }

    // Update the category name with the provided value (converted to lowercase)
    await CategoryModel.findOneAndUpdate(
      { _id: id },
      { category: category.toLowerCase() }
    );

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
}


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /categories/remove/{id}:
 *   delete:
 *     summary: Remove a Category
 *     description: Remove a category identified by its ID.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to remove
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Category not found
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

  exports.removeCategory=async (req, res) => {
    // Extract the category ID from the URL parameter
    const id = req.params.id;
  
    try {
      // Find the category with the provided ID
      const findCategory = await CategoryModel.findOne({ _id: id });
  
      // If the category is not found, return a 404 Not Found status with an error message
      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
  
      // Delete the category from the database
      await CategoryModel.findOneAndDelete({ _id: id });
  
      // Return a success message with a 200 OK status
      res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      return res.status(500).send({ message: error.message });
    }
  }