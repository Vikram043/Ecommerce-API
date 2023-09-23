<p align="center">
  <h3 align="center">E-commerce API Documentation</h3>
  <p align="center">
    A brief description of your project.
    <br />
    <a href="https://yourprojectdemo.link/"><strong>Explore the documentation »</strong></a>
    <br />
    <br />
    <a href="https://yourprojectdemo.link/">View Demo</a>
    ·
    <a href="https://yourprojectdemo.link/">Report Bug</a>
    ·
    <a href="https://yourprojectdemo.link/">Request Feature</a>
  </p>
</p>

## Table of Contents

- [Endpoints](#endpoints)
  - [User Routes](#user-routes)
  - [Product Routes](#product-routes)
  - [Order Routes](#order-routes)
  - [Category Routes](#category-routes)
  - [Cart Routes](#cart-routes)
- [Database Integration](#database-integration)
- [Authentication and Security](#authentication-and-security)
- [Error Handling](#error-handling)
- [Documentation](#documentation)

## Endpoints

### User Routes

- **POST /signup**
  - Description: Register a new user.
- **POST /login**
  - Description: User login.

Authentication is required for the following routes:

- **GET /details**
  - Description: Get user details by ID.
- **GET /logout**
  - Description: Logout the user.

### Product Routes

- **POST /add**
  - Description: Add a new product.
- **GET /category/:categoryId**
  - Description: Retrieve a list of products based on category ID.
- **GET /:id**
  - Description: Get product details by ID.
- **PATCH /update/:id**
  - Description: Update product details.
- **DELETE /delete/:id**
  - Description: Delete a product by ID.

### Order Routes

- **GET /all**
  - Description: Get all orders.
- **GET /details/:id**
  - Description: Get order details by ID.
- **POST /add/:productId**
  - Description: Place an order for a product.
- **PATCH /return/:orderId**
  - Description: Return an order.
- **DELETE /cancel/:orderId**
  - Description: Cancel an order.

### Category Routes

- **POST /add**
  - Description: Add a new product category.
- **GET /all**
  - Description: Get all product categories.
- **PATCH /update/:id**
  - Description: Update product category by ID.
- **DELETE /remove/:id**
  - Description: Remove a product category by ID.

### Cart Routes

Authentication is required for the following routes:

- **GET /items**
  - Description: Get items in the user's cart.
- **POST /add**
  - Description: Add a product to the user's cart.
- **DELETE /remove/:id**
  - Description: Remove an item from the user's cart.
- **PATCH /increase/:id**
  - Description: Increase the quantity of an item in the cart.
- **PATCH /decrease/:id**
  - Description: Decrease the quantity of an item in the cart.

## Database Integration

The API integrates with a database (MongoDB or MySql) to store and manage product data, user cart information, and order details. It performs CRUD operations on products, cart items, and orders.

## Authentication and Security

- Authentication is implemented using JSON Web Tokens (JWT).
- Sensitive endpoints are protected with authentication middleware to allow only authenticated users.

## Error Handling

The API provides appropriate error handling, returning meaningful error messages and status codes when necessary.

## Documentation

Swagger documentation is available for API endpoints, including details about their functionality, expected input, and output.
