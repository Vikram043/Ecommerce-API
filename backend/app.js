const express=require('express')
const { connection } = require('./config/database')
const cors=require('cors')
const bodyParser=require('body-parser')
const cookieParcer=require("cookie-parser")
const { UserRouter } = require('./routes/user.routes')
const { ProductRouter } = require('./routes/product.routes')
const { CartRouter } = require('./routes/cart.routes')
const { CategoryRouter } = require('./routes/category.routes')
const { OrdersRouter } = require('./routes/order.routes')
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");
require('dotenv').config()

const app=express()
app.use(bodyParser.json())
app.use(cookieParcer())
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome To E-Commerce API");
  });

// Rate limiting settings (you can customize these values as per your requirement)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });

app.use(limiter);


app.use("/user", UserRouter); // User-related routes
app.use("/category", CategoryRouter); // Category-related routes
app.use("/product", ProductRouter); // Product-related routes
app.use("/cart", CartRouter); // Cart-related routes
app.use("/order", OrdersRouter); // Order-related routes


const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "E-Commerce API",
        version: "1.0.0",
      },
      servers: [
        {
          url: "https://triveous-ecommerce-api.onrender",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };

const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));





const port=process.env.port || 3001

app.listen(port,async()=>{
    try {
        await connection
        console.log(`MongoDB connected and port is ${port}`)
    } catch (error) {
        console.log(`Unbale to connect to MongoDB`,error)
    }
})