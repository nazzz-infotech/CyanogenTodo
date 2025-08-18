// main back-end server with express.js and mongoose
// express, cors, mongoose, uuid, body-parser variable
const express = require("express");
const cors = require("cors");
const { default: mongoose, Mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { v1: uuidv1 } = require("uuid");
const push = require("web-push");

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
  notifyingTimes: { type: Number, default: 0 },
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
    const current_time = ` ${hours}:${minutes}:${seconds}`;

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

/**
 * It is the key for my computer not for your. Follow these steps to get it for you.
 * First You Need npm and node installed on your computer.
 * Second You need to set node folder to your PATH environment variable.
 * ========================================================================================
 * 1. Open The Terminal to this folder (such as CMD, Powershell or macos / Linux Terminal)
 * 2. npm install
 * 3. node (node will open like this ">")
 * 4. type "const push = require("web-push");" then hit enter / return key
 * 5. console.log(push.generateVAPIDKeys());
 * 6. Copy Both with brackets 
 * 7. Select [ { publicKey: ...,
                privateKey: ...,
              }; ] 
  8. Paste The Copied Keys
 * ========================================================================================
  Your Key is ready to use !!!
  Impotent Note :- Copy the public key and paste into "front-end\src\api\api.jsx:137" (front-end folder) 
  [Copy "front-end\src\api\api.jsx:137" then Press Ctrl / Command + P and Paste it then enter / return.
  Note -> you need to open parent directory of it ]
 */

const vpidKeys = {
  publicKey:
    "BDNqk1wTM9-O2pvknGjWoIBiHCzPtAgpP3I66ckaKg6hoUK4oaRrjtOxSsGjm2PYFXZIh6YplrxI6e3EguvIBSc",
  privateKey: "dFHTynEdxGg4weUgkk6l2r11BdqddZL71rh4-dEd2ZM",
};

push.setVapidDetails(
  "mailto:example@example.com",
  vpidKeys.publicKey,
  vpidKeys.privateKey
);

/**
 * save Subscriptions into mongodb
 */

// in-memory array (will reset if server restarts)
let subscriptions = [];

// Mongoose schema
const SubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

async function startServer() {
  await connectDB();
  await loadSubscriptions();
  await CheckTodos();
  setInterval(CheckTodos, 30 * 1000);
}

startServer();

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

// After connectDB() is called and connection is ready
async function loadSubscriptions() {
  subscriptions = await Subscription.find();
  console.log(`Loaded ${subscriptions.length} subscriptions from DB`);
}

connectDB().then(loadSubscriptions);

// save subscription
app.post("/save-subscription", async (req, res) => {
  try {
    const subscription = req.body;

    // Validate
    if (!subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: "Invalid subscription format" });
    }

    // Prevent duplicates
    const exists = await Subscription.findOne({
      endpoint: subscription.endpoint,
    });
    if (!exists) {
      await Subscription.create(subscription);
    }

    res.status(201).json({ message: "Subscription saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// retrieve all from array (temporary memory)
app.get("/subscriptions", (req, res) => {
  res.json(subscriptions);
});

// retrieve all from MongoDB (permanent)
app.get("/subscriptions/db", async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

let CheckTodosTimes = 0; // how many time it run
// Run after 30 seconds, and keep running every 30 seconds
setInterval(CheckTodos, 30 * 1000); // 30,000 ms = 30 seconds

// send notification with a function
async function sendNotification(title, body, badge) {
  try {
    const payload = JSON.stringify({
      title: title,
      body: body,
      badge: badge,
    });

    const allSubs = await Subscription.find();

    await Promise.all(
      allSubs.map((sub) => push.sendNotification(sub.toObject(), payload))
    );

    return "Push sent";
  } catch (err) {
    // a condition for avoid unwanted error
    if (
      err.message ===
      "You must pass in a subscription with at least an endpoint."
    ) {
      console.log("Notification Sent !");
    } else {
      console.error(`Notification Send Error, ${err}`);
    }
  }
}

// a test notification
app.post("/testnotification", async (req, res) => {
  try {
    sendNotification(
      "Test Notification !!!",
      "A Notification for test only !!!",
      "./test.png"
    );
    res.status(201).json({ message: "Test notification done !!!" });
  } catch (err) {
    if (
      err.message ===
      "You must pass in a subscription with at least an endpoint."
    ) {
      res.status(201).json({ message: "Test notification done !!!" });
    } else {
      console.error(`Notification Send Error, ${err}`);
    }
  }
});

/**
 * Check the todo after 30 seconds
 */

// change the todo
async function changeTodoNotifyingTimes(_id) {
  try {
    const existing_value = await Todo.findById(_id);
    const new_value = (existing_value.notifyingTimes=+1);
    await Todo.findByIdAndUpdate(
      _id,
      { notifyingTimes: new_value },
      { new: true }
    );
    return "Todo notifyingTimes changed";
  } catch (error) {
    return `Error in todo notifyingTimes changing. ${error}`;
  }
}

// it will return boolean
// returns object but still works for boolean checks
function isWithinRange(dateTimeStr, minMinutes, maxMinutes) {
  const now = new Date();
  const newDateAndTime = String(dateTimeStr).toLowerCase();
  // Split date and time parts
  const [datePart, timePart, meridianRaw] = newDateAndTime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  let [hours, minutes] = timePart.split(":").map(Number);

  const meridian = meridianRaw ? meridianRaw.toLowerCase() : "";

  // Convert 12-hour to 24-hour format
  if (meridian === "pm" && hours !== 12) hours += 12;
  if (meridian === "am" && hours === 12) hours = 0;

  const target = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const diffMinutes = (target - now) / 60000; // ms → min

  if (diffMinutes <= 0) {
    return { inRange: false, expired: true, minutesLeft: 0 };
  }

  return {
    inRange: diffMinutes >= minMinutes && diffMinutes <= maxMinutes,
    expired: false,
    minutesLeft: Math.floor(diffMinutes),
  };
}

async function CheckTodos() {
  const todos = await Todo.find();
  CheckTodosTimes++;
  console.log(`CheckTodos run #${CheckTodosTimes}`);

  // clear the all logs after 250 run of CheckTodos
  if (CheckTodosTimes === 250) {
    console.clear();
  }

  todos.map(async (todo) => {
    const dateTime = `${todo.date} ${todo.time}`;

    if (todo.checked) return; // skip completed tasks

    // 1 hr
    const hrCheck = isWithinRange(dateTime, 55, 60);
    if (hrCheck.inRange && todo.notifyingTimes < 1) {
      await sendNotification(
        `${todo.title} - 1 hour remaining`,
        `You have about 1 hour left to complete ${todo.title}.`,
        "./1hr.png"
      );
      await changeTodoNotifyingTimes(todo._id);
    }

    // 30 min
    const min30Check = isWithinRange(dateTime, 25, 30);
    if (min30Check.inRange && todo.notifyingTimes < 2) {
      await sendNotification(
        `${todo.title} - 30 minutes remaining`,
        `You have about 30 minutes left to complete ${todo.title}.`,
        "./30min.png"
      );
      await changeTodoNotifyingTimes(todo._id);
    }

    // 15 min
    const min15Check = isWithinRange(dateTime, 10, 15);
    if (min15Check.inRange && todo.notifyingTimes < 3) {
      await sendNotification(
        `Hurry! 15 minutes left for ${todo.title}`,
        `Only about 15 minutes remaining to finish ${todo.title}.`,
        "./15min.png"
      );
      await changeTodoNotifyingTimes(todo._id);
    }

    // 5 min
    const min5Check = isWithinRange(dateTime, 0, 5);
    if (min5Check.inRange && todo.notifyingTimes < 4) {
      await sendNotification(
        `Hey, Hurry! 5 minutes left for ${todo.title}`,
        `There's only about 5 minutes remaining to finish ${todo.title}.`,
        "./5min.png"
      );
      await changeTodoNotifyingTimes(todo._id);
    }
  });
}

// port
const port = process.env.PORT || 5000;

// start the app
app.listen(port, () => {
  console.info(`Express Sever Runs on http://localhost:${port}`);
});
