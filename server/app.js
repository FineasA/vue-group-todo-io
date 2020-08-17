const PORT = process.env.PORT || 3000;
const express = require("express");
const serveStatic = require("serve-static");
const Datastore = require("nedb");
const axios = require("axios").default;
const path = require("path");

const app = express();

if (!process.env.PORT || process.env.NODE_ENV === "development") {
  app.use("/", serveStatic(path.join(__dirname, "../public")));
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + "../public/index.html");
  });
} else {
  //when in production
  app.use("/", serveStatic(path.join(__dirname, "../dist")));
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + "../dist/index.html");
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

const database = new Datastore({
  filename: "database.db",
  timestampData: true,
});
database.loadDatabase();

const io = require("socket.io")(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true,
    };

    res.writeHead(200, headers);
    res.end();
  },
});

app.get("/api", (req, res) => {
  console.log(res.json({ test: 123 }));
});

//this is where we'll put a get request for data to load onto clients

io.on("connection", (socket) => {
  //update users list when user joins

  //whenever i want to delete the database run this code.
  // database.remove({}, { multi: true });

  database
    .find({})
    .sort({ createdAt: 1 })
    .exec((err, data) => {
      // console.log(data);
      io.emit("data-recieved", data);
    });

  console.log(socket.id);
  socket.on("user-joined", (user) => {
    io.emit("username-sent", user.username);
  });

  socket.on("user-entered-task", (taskData) => {
    database.insert(taskData);

    io.emit("send-task-data", taskData);
  });

  socket.on("user-edited-task", (editData) => {
    io.emit("send-edited-data", editData);
  });
});
