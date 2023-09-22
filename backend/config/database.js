const mongoose=require('mongoose')
require("dotenv").config();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const connection=mongoose.connect(process.env.MONGO_URL)


module.exports={connection}

