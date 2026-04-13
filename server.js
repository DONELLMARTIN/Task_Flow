const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

const SECRET = "mysecretkey";

// DB
mongoose.connect("mongodb://localhost:27017/TaskFlow")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// USER
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  profile: String,
});
const User = mongoose.model("User", userSchema);

// TASK
const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  date: String,
  priority: String,
  reminder: String,
  customDate: String,
  status: String
});
const Task = mongoose.model("Task", taskSchema);

// 🔐 MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// REGISTER
app.post("/register", async (req, res) => {
  const { name, phone, email, password, profile } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    phone,
    email,
    password: hashedPassword,
    profile
  });

  await user.save();
  res.json({ message: "Registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, email: user.email, profile: user.profile },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ user, token });
});

// CREATE TASK
app.post("/tasks", authMiddleware, async (req, res) => {
  const task = new Task({
    userId: req.user.id,
    ...req.body
  });

  await task.save();
  res.json({ message: "Task created" });
});

// GET TASKS
app.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// DELETE TASK
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🔹 UPDATE STATUS
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    await Task.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Task updated" });

  } catch {
    res.status(500).json({ message: "Error updating task" });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));
