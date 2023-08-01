const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

app.use(cors());
const server = http.createServer(app);

const users = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Connected User: ${socket}`);

  socket.on("sendMessage", (data) => {
    console.log("data", data)
    socket.to(data.conversation_id).emit("receiveMessage", data);
  });

  socket.on("joinConversation", (data, cb) => {
    socket.join(data.conversation_id);
    cb({ ...data, content: `${data.person_id} just joined the room.` });
    // socket.to(data.conversation_id).emit("joinedUser", data);
    // const userExist = users.some((el) => el.person_id === data.person_id);
    // if (!userExist) users.push(data);
    // console.log("users", users);
  });

  socket.on("upload", (file, callback) => {
    console.log(file); // <Buffer 25 50 44 ...>

    // save the content to the disk, for example
    fs.writeFile("/Users/arbenaziri/Downloads", file, (err) => {
      console.log("err", err)
      callback({ message: err ? "failure" : "success" });
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
