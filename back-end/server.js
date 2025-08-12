// main back-end server with express.js and mongoose
// express, cors, mongoose variable
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { v1: uuidv1 } = require("uuid");

// initialize the app with express
const app = express();

// Enable Json
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const todoSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: String,
  checked: { type: Boolean, default: false },
  date: { type: String, default: "None" },
  time: { type: String, default: "None" },
});

const Todo = mongoose.model("Todo", todoSchema);

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/cmt_db", {
      // Optional: Add connection options here
      // useNewUrlParser: true, // Deprecated in newer Mongoose versions
      // useUnifiedTopology: true, // Deprecated in newer Mongoose versions
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application on connection failure
  }
}

connectDB();

// the query function
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to read todo" });
  }
});

// create a test item
app.post("/createtestitem", async (req, res) => {
  try {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const current_time = `${hours}:${minutes}:${seconds}`;

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const current_date = `${year}-${month}-${day}`;
    // Example output: 8/4/2025

    const todo = new Todo({
      _id: uuidv4(),
      title: `Test Todo #${uuidv1()}`,
      content: `Todo Created at ${Date.now()}`,
      time: current_time,
      date: current_date,
      checked: false,
    });

    await todo.save();

    res.status(201).json({ message: "Test Todo Created Successfully !!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to create test todo" });
  }
});

// drop / delate all todos
app.delete("/drop", async (req, res) => {
  try {
    await mongoose.connection.db.dropDatabase();
    res.status(201).json({ message: "Database drop successfully !!! " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed To drop database" });
  }
});

//create new
app.post("/new", async (req, res) => {
  try {
    const { title, content, time, date } = req.body;
    const todo = new Todo({
      _id: uuidv4(),
      title: title,
      content: content,
      time: time,
      date: date,
    });

    await todo.save();
    res.status(201).json({ message: "Todo added successfully !!!", todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed To Create Todo" });
  }
});

//edit / update the todo
app.put("/update", async (req, res) => {
  try {
    const { _id, title, content, time, date } = req.body;

    await Todo.findByIdAndUpdate(
      _id,
      { title, content, time, date },
      { new: true }
    );
    res.status(201).json({ message: "Todo Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in the updating todo" });
  }
});

//delete a single todo by id
app.delete("/delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    await Todo.findByIdAndDelete(_id);
    res.status(201).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed To Delete Todo" });
  }
});

app.get("/queryfromid/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const todo = await Todo.findOne({ _id: _id });
    res.send(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in query the todo for name" });
  }
});

app.patch("/toggle/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const existing_value = await Todo.findById(_id);
    const new_value = !existing_value.checked;
    await Todo.findByIdAndUpdate(_id, { checked: new_value }, { new: true });
    res.status(201).json({ message: "Todo State Toggle Successful !!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed To Toggle Todo State" });
  }
});

app.patch("/checkall", async (req, res) => {
  try {
    const todos = await Todo.find();
    todos.map(async (todo) => {
      await Todo.findByIdAndUpdate(todo._id, { checked: true }, { new: true });
    });
    res.status(201).json({ message: "All Todo Check Successfully !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to check all todos" });
  }
});

app.patch("/uncheckall", async (req, res) => {
  try {
    const todos = await Todo.find();
    todos.map(async (todo) => {
      await Todo.findByIdAndUpdate(todo._id, { checked: false }, { new: true });
    });
    res.status(201).json({ message: "All Todo Check Successfully !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to check all todos" });
  }
});

// port
const port = process.env.PORT || 5000;

// start the app
app.listen(port, () => {
  console.info(`Express Sever Runs on http://localhost:${port}`);
});
