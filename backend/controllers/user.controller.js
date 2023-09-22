const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const UserModel = require("../models/user.model")


exports.signUp=async (req, res) => {
  
    const { name, email, password, phone } = req.body;
  
    if (!name || !email || !phone || !password) {
      return res.status(409).send({ message: "Please provide all fields" });
    }
  
    try {

      const userWithEmailExists = await UserModel.findOne({ email });
      if (userWithEmailExists) return res.status(409).send({message: `Email already registered`});
      
      const hash=bcrypt.hashSync(password, saltRounds) 
      if (!hash) return res.status(500).send({ message: err.message })
  
      const user = new UserModel({
        name,
        email,
        password: hashedPass,
        phone,
      });
  
      // Save the user to the database
      await user.save();

      res.status(201).send({ message: "User Registered Successfully" })
        
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }


exports.login=async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(409).send({ message: "Provide email and password to login" });
  }

  try {
    
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const decode=bcrypt.compareSync(password, user.password)
      if (!decode) {
        return res.status(401).send({ message: "Wrong Credentials" });
      }

      const expiresIn = 7 * 24 * 60 * 60;
      const AccessToken = jwt.sign(
        { userID: user._id, role: "user" },
        SECRET_KEY,
        {
          expiresIn,
        })

      res.cookie("AccessToken", AccessToken);

      res.status(200).send({
        message: "Login Successful",
        userInfo: user,
      });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}



exports.details=async (req, res) => {

    const userID = req.body.userID;
  
    try {
      const user = await UserModel.findOne({ _id: userID });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }
  
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


exports.logout=async(req,res)=>{
    try {
        const{AccessToken}=req.cookies
        if(!AccessToken) return res.status(400).send({msg:"You are already logged out"}) 

        res.clearCookie("AccessToken");

        return res.status(200).send({msg:"Succesfully loged out"})  

    } catch (error) {
        return res.status(500).send({msg:error}) 
    }
}

