const PORT = process.env.PORT || 8080;
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();

app.use("/", serveStatic(path.join(__dirname, "../dist")));

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

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

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("user-joined", (user) => {
    //update users list when user joins
    io.emit("username-sent", user.username);
  });

  socket.on("user-entered-task", (taskData) => {
    io.emit("send-task-data", taskData);
  });
});
