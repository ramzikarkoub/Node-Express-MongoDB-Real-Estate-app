import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// REGISTER USER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // CHECK IF USER ALREADY EXISTS
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE NEW USER AND SAVE TO DB
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const { password: userPassword, ...userInfo } = newUser._doc;

    // GENERATE JWT TOKEN
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // STORE TOKEN IN HTTP-ONLY COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000,
    });

    // SEND USER INFO WITHOUT PASSWORD
    res
      .status(201)
      .json({ message: "User registered successfully", user: userInfo });
  } catch (error) {
    console.error(`Error registering user: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // CHECK IF USER EXISTS
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // VERIFY PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // GENERATE JWT TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // STORE TOKEN IN HTTP-ONLY COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000,
    });

    const { password: userPassword, ...userInfo } = user._doc;
    res.status(200).json(userInfo);
  } catch (error) {
    console.error(` Error logging in: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT USER
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

// CHECK IF USER IS AUTHENTICATED AND RETURN USER DATA
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};
