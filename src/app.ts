import express from "express";
import * as http from "http";
import path from "path";
const app = express();
const socketIo = require("socket.io");
import Filter from "bad-words";
import { generateMessage, generateLocationMessage } from "./utils/messages";

import { Socket } from "socket.io";

const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

io.on("connection", (socket: Socket) => {
  socket.emit("message", generateMessage("Welcome"));

  socket.broadcast.emit(
    "message",
    generateMessage("A New User Has Joined The chat")
  );

  socket.on("newMessage", (message, cb) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed");
    }
    io.emit("message", generateMessage(message));
    cb();
  });

  socket.on("sendLocation", (position) => {
    const LocationUrl = `https://google.com/maps?q=${position.latitude},${position.longitude}`;
    // io.emit("message", LocationUrl);
    io.emit("LocationMessage", generateLocationMessage(LocationUrl));
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A User Has Left the Chat"));
  });
});

server.listen(port, () => console.log("Server is running on port" + port));
