const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const UserModel = require("../models/user.model");
const saltRounds=+process.env.saltRounds
const SECRET_KEY=process.env.SECRET_KEY
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (used for registration).
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password for authentication.
 *               phone:
 *                 type: number
 *                 description: User's phone number.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Please provide all required fields.
 *       409:
 *         description: Conflict. Email already registered.
 *       500:
 *         description: Internal server error. Please try again later.
 */


exports.signUp = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).send({ message: "Please provide all required fields" });
  }

  try {
    const userWithEmailExists = await UserModel.findOne({ email });
    if (userWithEmailExists) return res.status(409).send({ message: "Email already registered" });

    const hash = bcrypt.hashSync(password, saltRounds);
    if (!hash) return res.status(500).send({ message: "Error hashing the password" });

    const user = new UserModel({
      name,
      email,
      password: hash, 
      phone,
    });

    // Save the user to the database
    await user.save();

    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       description: User login credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (used for login).
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password for authentication.
 *     responses:
 *       200:
 *         description: Login successful. Returns user information and access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful login.
 *                 userInfo:
 *                   
 *       401:
 *         description: Unauthorized. Wrong credentials provided.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Please try again later.
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Provide email and password to login" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Wrong Credentials" });
    }

    const expiresIn = 7 * 24 * 60 * 60;
    const AccessToken = jwt.sign(
      { userID: user._id, role: "user" },
      SECRET_KEY,
      {
        expiresIn,
      }
    );

    res.cookie("AccessToken", AccessToken);

    res.status(200).send({
      message: "Login Successful",
      userInfo: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: User's ID to retrieve details.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               
 *       401:
 *         description: Unauthorized. User not found.
 *       500:
 *         description: Internal server error. Please try again later.
 */


exports.details = async (req, res) => {
  const userID = req.query.userID;

  if (!userID) {
    return res.status(400).send({ message: "Provide userID to retrieve details" });
  }

  try {
    const user = await UserModel.findOne({ _id: userID });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout the user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful. User is logged out.
 *       400:
 *         description: Bad request. User is already logged out (no access token found).
 *       500:
 *         description: Internal server error. Please try again later.
 */

exports.logout = async (req, res) => {
  try {
    const { AccessToken } = req.cookies;
    
    if (!AccessToken) {
      return res.status(400).send({ message: "You are already logged out" });
    }

    res.clearCookie("AccessToken");

    res.status(200).send({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

