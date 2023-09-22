const CategoryModel = require("../models/category.model");
const ProductModel = require("../models/prodect.model");


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to managing products
 */

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       description: Product information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product.
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *               availability:
 *                 type: boolean
 *                 description: Availability status of the product (true/false).
 *               categoryId:
 *                 type: string
 *                 description: ID of the category to which the product belongs. Should be a valid ObjectId.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs for the product.
 *     responses:
 *       201:
 *         description: Product added successfully.
 *       400:
 *         description: Bad request. Please provide all required details.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error. Please try again later.
 */

exports.addProduct = async (req, res) => {
  const { title, price, description, availability, categoryId, images } = req.body;

  try {
    if (!title || !price || !description || !availability || !categoryId || !images) {
      return res.status(400).send({ message: "Please provide all required details" });
    }

    const findCategory = await CategoryModel.findOne({ _id: categoryId });

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
};



/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Find Products by Category
 *     description: Retrieve a list of products associated with a specific category.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         description: ID of the category to find products for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of products found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
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

module.exports.findProduct = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const findCategory = await CategoryModel.findOne({ _id: categoryId });

    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    const products = await ProductModel.find({ categoryId });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}



/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a Product by ID
 *     description: Retrieve a product by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Product not found
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

module.exports.product = async (req, res) => {
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


/**
 * @swagger
 * /products/update/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK - Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product or Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

module.exports.productUpdate = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  try {
    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (payload.categoryId) {
      const findCategory = await CategoryModel.findOne({
        _id: payload.categoryId,
      });

      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
    }

    // Use updateOne to update the product
    const updateResult = await ProductModel.updateOne({ _id: id }, payload);

    if (updateResult.nModified === 0) {
      return res.status(500).send({ message: "Product update failed" });
    }

    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}










/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Delete a Product
 *     description: Delete a product identified by its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Product not found
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

module.exports.productDelete = async (req, res) => {
  // Extract the product ID from the URL parameter
  const id = req.params.id;
    console.log(id)
  try {
    const product = await ProductModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    await ProductModel.findByIdAndDelete({ _id: id });

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
