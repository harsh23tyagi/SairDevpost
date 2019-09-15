const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http").Server(app);

const io = require("socket.io")(http);
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(express.static(__dirname + "/public"));
let clients = 0;
var sentHolder = {};
console.log("Checking connetion");

io.on("connection", socket => {
  console.log("Connected with id " + clients);
  sentHolder[clients] = false;
  if (!sentHolder[clients]) {
    console.log("Entered" + sentHolder[clients]);
    socket.emit("ClientID", clients);
    sentHolder[clients] = true;
    clients++;
  }
  socket.on("disconnect", Disconnect);
});

function Disconnect() {
  clients--;
  console.log(clients);
}

http.listen(port, () => console.log(`Active on ${port} port`));

// const mongoose = require("mongoose");
// const express = require("express");
// const bodyparser = require("body-parser");
// const route = require("./Routes/routes");
// const app = express();
// const socket = require("socket.io");
// // const http = require("http");
// const videochatBackend = require("./videochat/videochatBackend");
// const peer = require("peer");
// const cors = require("cors");
// //body-parser middleware
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(bodyparser.json());
// //const bodyPix = require("@tensorflow-models/body-pix");
// //Main Page
// app.get("/", (req, res) => res.send("Hello World"));
// app.use("/route", route);
// app.use("/videochat", videochatBackend);

// app.use(cors());

// // app.use("/peerjs", require("peer").ExpressPeerServer(srv, { debug: true }));

// //---videochat2---
// const http = require("http").Server(app);
// // const io = require("socket.io")(http);
// // // const port = process.env.PORT || 3000

// // app.use(express.static(__dirname + "/public"));
// // let clients = 0;

// // io.on("connection", function(socket) {
// //   socket.on("NewClient", function() {
// //     if (clients < 2) {
// //       if (clients == 1) {
// //         this.emit("CreatePeer");
// //       }
// //     } else this.emit("SessionActive");
// //     clients++;
// //   });
// //   socket.on("Offer", SendOffer);
// //   socket.on("Answer", SendAnswer);
// //   socket.on("disconnect", Disconnect);
// //   socket.on("NewStream", reloadPages);
// // });

// // function reloadPages() {
// //   this.emit("reload");
// // }
// // function Disconnect() {
// //   if (clients > 0) {
// //     if (clients <= 2) this.broadcast.emit("Disconnect");
// //     clients--;
// //   }
// // }

// // function SendOffer(offer) {
// //   this.broadcast.emit("BackOffer", offer);
// // }

// // function SendAnswer(data) {
// //   this.broadcast.emit("BackAnswer", data);
// // }

// //--vidchat2 ends

// //------------------------= checking socket.io connection =--------------------------
// // const server = http.createServer(app);
// // const io = socket.listen(server);

// // const getApiAndEmit = async socket => {
// //   socket.emit("SetupMsg", "Socket connection setup");
// //   console.log("EMITTED");
// // };

// // let interval;
// // io.on("connection", socket => {
// //   console.log("New client connected");
// //   if (interval) {
// //     clearInterval(interval);
// //   }
// //   interval = setInterval(() => getApiAndEmit(socket), 10000);
// //   socket.on("disconnect", () => {
// //     console.log("Client disconnected");
// //   });
// // });

// //------------------------= checking socket.io connection ends =--------------------------

// //Video chat express code begins
// // let clients = 0;
// // io.on("connection", function(socket) {
// //   socket.on("NewClient", function() {
// //     if (clients < 2) {
// //       if (clients == 1) {
// //         this.emit("CreatePeer");
// //       }
// //     } else this.emit("SessionActive");
// //     clients++;
// //   });
// //   socket.on("Offer", SendOffer);
// //   socket.on("Answer", SendAnswer);
// //   socket.on("disconnect", Disconnect);
// // });

// // function Disconnect() {
// //   if (clients > 0) {
// //     if (clients <= 2) this.broadcast.emit("Disconnect");
// //     clients--;
// //   }
// // }

// // function SendOffer(offer) {
// //   this.broadcast.emit("BackOffer", offer);
// // }

// // function SendAnswer(data) {
// //   this.broadcast.emit("BackAnswer", data);
// // }

// //-------------Main Declaritions------------
// const port = process.env.PORT || 5000;
// const port2 = 5000;
// // app.listen(port, () => console.log(`Serve running at port ${port}`));
// // server.listen(port2, () => console.log(`Socket Io server running on ${port2}`));
// http.listen(port2, () => console.log(`Socket Io server running on ${port2}`));
// // Ending process
// // lsof -i  tcp: 5060
// // kill -9 <<pid>>
// proxy- "http://localhost:5000"
