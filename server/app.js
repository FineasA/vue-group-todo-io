const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();

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
