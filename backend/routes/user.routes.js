const express = require("express");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { Authentication } = require("../middleware/authentication.middlewere");
const { signUp, details, login, logout } = require("../controllers/user.controller");
const saltRounds = +process.env.saltRounds;
const SECRET_KEY = process.env.SECRET_KEY;




UserRouter.post("/signup", signUp);
UserRouter.post("/login", login);



UserRouter.use(Authentication);

UserRouter.get("/details", details);
UserRouter.get("/logout", logout);

// Export the UserRouter to be used in other parts of the application
module.exports = { UserRouter };