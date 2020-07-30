const PORT = process.env.PORT || 8080;
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();

app.use("/", serveStatic(path.join(__dirname, "../dist")));

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

const io = require("socket.io")(server);

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
