// // import * as peer from "simple-peer";
// // import * as sock from "socket.io";
// //let peer = require("simple-peer");
// // import io from "socket.io-client";

// let peer = require("simple-peer");
// let socket = io();
// const video = document.querySelector("video");
// let client = {};
// navigator.mediaDevices
//   .getUserMedia({ video: true, audio: true })
//   .then(stream => {
//     socket.emit("newClientAdded");
//     video.srcObject = stream;
//     video.play();

//     //function to check Peer
//     function initPeer(type) {
//       let peer = new peer.Peer({
//         initiator: type == "init" ? true : false,
//         stream: stream,
//         trickle: false
//       });
//       peer.on("stream", function(stream) {
//         // CreateVideo(stream);
//       });
//       peer.on("close", function() {
//         document.getElementById("peerVideo").remove();
//         peer.destroy();
//       });
//       return peer;
//     }

//     //function to make peer of type init
//     function makePeer() {
//       client.gotAnswer = false;
//       let peer = initPeer("init");
//       peer.on("signal", function(data) {
//         //sending the offer
//         if (!client.gotAnswer) {
//           socket.emit("Offer");
//         }
//       });
//       client.peer = peer;
//     }

//     function frontAnswer() {
//       let peer = initPeer("notinit");
//       //signal function will not run automatically therefore we will have to run it manually
//       peer.on();
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });
