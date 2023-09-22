const jwt = require("jsonwebtoken");
require("dotenv").config();


const Authentication = (req, res, next) => {
    try {

    let token = req.cookies.AccessToken 

  
    if (!token) return res.status(401).send({ message: "Access Denied Please login" });

    const decoded=jwt.verify(token, process.env.SECRET_KEY)

    if (!decoded) {
      return res.status(404).send({ message: err.message });
    }
      req.body.userID = decoded.userID;
      next();
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};


module.exports = {
  Authentication,
};