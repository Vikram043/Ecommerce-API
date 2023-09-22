const express=require('express')
const { connection } = require('./config/database')
const cors=require('cors')
const bodyParser=require('body-parser')
const cookieParcer=require("cookie-parser")

require('dotenv').config()

const app=express()
app.use(bodyParser.json())
app.use(cookieParcer())
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome To E-Commerce API");
  });







const port=process.env.port || 3001

app.listen(port,async()=>{
    try {
        await connection
        console.log(`MongoDB connected and port is ${port}`)
    } catch (error) {
        console.log(`Unbale to connect to MongoDB`,error)
    }
})