const PORT = process.env.PORT || 3000;
const express = require("express");
const serveStatic = require("serve-static");
const Datastore = require("nedb");

const path = require("path");

const app = express();

let users = [];
let usersOnline = [];

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

const usersDatabase = new Datastore({
  filename: "users.db",
  timestampData: true,
});

usersDatabase.loadDatabase();
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

io.on("connection", (socket) => {
  socket.on("create-account", (newUser) => {
    usersDatabase.find({ username: newUser.username }, (err, docs) => {
      if (docs.length > 0) {
        socket.emit("authentication-failed", true);
      } else if (docs.length === 0) {
        newUser.online = true;
        console.log("New user with online object: ", newUser);
        usersDatabase.insert(newUser);
        socket.emit("automatic-login");
      }
    });
  });

  socket.on("auth-login", (user) => {
    usersDatabase.findOne(
      { username: user.username, password: user.password },
      (err, loginAuth) => {
        console.log(loginAuth);
        console.log(user.password);
        if (loginAuth === null || loginAuth.password !== user.password) {
          socket.emit("login-failed", true);
        } else {
          socket.emit("login-success", true);
        }
      }
    );
  });

  //whenever i want to delete the database run this code.
  // database.remove({}, { multi: true });
  // usersDatabase.remove({}, { multi: true });

  //update users list when user joins

  database
    .find({})
    .sort({ createdAt: 1 })
    .exec((err, data) => {
      // console.log(data);
      io.emit("data-recieved", data);
    });

  //send all users
  usersDatabase
    .find({})
    .sort({ createdAt: 1 })
    .exec((err, users) => {
      io.emit("send-users", users);
    });

  socket.on("user-joined", (userName) => {
    console.log("Debug: ", userName);
    console.log("User-joined: username: ", userName);
    usersDatabase.update(
      {
        username: userName.username,
      },
      {
        $set: {
          online: true,
        },
      },
      (err, numReplaced) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success replacing ", numReplaced, "items.");
        }
      }
    );
    usersOnline.push(userName);

    //send updated users online to clients
    usersDatabase
      .find({})
      .sort({ createdAt: 1 })
      .exec((err, users) => {
        io.emit("users-list-updated", users);
      });
  });

  socket.on("user-entered-task", (taskData) => {
    database.insert(taskData);

    io.emit("send-task-data", taskData);
  });

  socket.on("user-edited-task", (editData, oldTask) => {
    io.emit("send-edited-data", editData);

    database.update(
      {
        todo: oldTask,
      },
      { editData },
      (err, numReplaced) => {
        console.log("Num replaced : ", numReplaced);
      }
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    if (reason === "transport close") {
      //filter userOnline array with socket.id and return username to filter on client side
      let userDisconnected = usersOnline.filter(
        (user) => user.socketId === socket.id
      );
      //update users database
      console.log("User disconnected: ", userDisconnected);
      if (userDisconnected.length > 0) {
        usersDatabase.update(
          {
            username: userDisconnected[0].username,
          },
          {
            $set: {
              online: false,
            },
          },
          (err, numReplaced) => {
            if (err) {
              console.log(err);
            } else {
              console.log(numReplaced);
            }
          }
        );

        //send updated users online list
        usersDatabase
          .find({})
          .sort({ createdAt: 1 })
          .exec((err, users) => {
            console.log("Re:sort: ", users);
            io.emit("users-list-updated", users);
          });
      } else {
        return;
      }

      const updatedUsers = usersOnline.filter(
        (user) => user.socketId !== socket.id
      );
      usersOnline = updatedUsers;

      if (userDisconnected.length > 0) {
        io.emit("user-disconnected-update", userDisconnected[0].username);
        console.log("User disconnected: ", userDisconnected[0].username);
      }
    }
  });
});
