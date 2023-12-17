// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: ["http://localhost:3001"],
  },
});

app.get("/", (req, res) => {
  res.send("welcome to server");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("callUser", ({ toCall, from, signalData, name }) => {
    console.log("send call recieved");
    
    io.to(toCall).emit("callUser", {
      signal: signalData,
      name: name,
      from: from,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("answer call recieved");
    console.log(data.to);
    io.to(data.to).emit("answerCall", { signal: data.signal, name: data.name });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("call Ended");
  });
  
});

const port = 3000;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
