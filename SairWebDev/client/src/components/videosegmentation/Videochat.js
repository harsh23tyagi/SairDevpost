import React, { Fragment, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
// let Peer = require("simple-peer");
// import * as Peer from "simple-peer";
import Peer from "peerjs";
// let Peer = require("simple-peer");

// const video = document.querySelector("video");
let client = {};

// We can also pass an object with width and height for the video parameter of the getUSerMedia
const Videochat = () => {
  const [socketinfo, setsocketinfo] = useState({
    response: "false",
    endpoint: "http://127.0.0.1:5000"
  });
  const socket = socketIOClient(socketinfo.endpoint);
  var str = null;

  useEffect(() => {
    const video = document.querySelector("video");

    //Getting our own video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        socket.emit("NewClient");
        video.srcObject = stream;
        video.play();

        //Initializing Peer
        function InitPeer(type) {
          let peer = new Peer({
            initiator: type == "init" ? true : false,
            stream: stream,
            trickle: false
          });

          console.log(peer.stream);
          //   socket.emit("connectReq");
          // CreateVideo(stream);
          //   socket.emit("NewStream", "Newclientadded");
          peer.on("stream", function(stream) {
            CreateVideo(stream);
          });
          //This isn't working in chrome; works perfectly in firefox.
          // peer.on('close', function () {
          //     document.getElementById("peerVideo").remove();
          //     peer.destroy()
          // })
          peer.on("data", function(data) {
            CreateVideo(stream);
            let decodedData = new TextDecoder("utf-8").decode(data);
            let peervideo = document.querySelector("#peerVideo");
            peervideo.style.filter = decodedData;
          });
          return peer;
        }

        //for peer of type init
        function MakePeer() {
          console.log("Request to create peer");
          client.gotAnswer = false;
          let peer = InitPeer("init");
          peer.on("signal", function(data) {
            if (!client.gotAnswer) {
              socket.emit("Offer", data);
            }
          });
          client.peer = peer;
        }

        //for peer of type not init
        function FrontAnswer(offer) {
          let peer = InitPeer("notInit");
          peer.on("signal", data => {
            socket.emit("Answer", data);
          });
          peer.signal(offer);
          client.peer = peer;
        }

        function SignalAnswer(answer) {
          client.gotAnswer = true;
          let peer = client.peer;
          peer.signal(answer);
        }

        function CreateVideo(stream) {
          //   CreateDiv();

          let video = document.createElement("video");
          video.id = "peerVideo";
          video.srcObject = stream;
          video.setAttribute("class", "embed-responsive-item");
          document.querySelector("#peerVideo").appendChild(video);
          video.play();
          //wait for 1 sec
          //   setTimeout(() => SendFilter(currentFilter), 1000);

          //   video.addEventListener("click", () => {
          //     if (video.volume != 0) video.volume = 0;
          //     else video.volume = 1;
          //   });
        }

        function SessionActive() {
          document.write("Session Active. Please come back later");
        }

        function RemovePeer() {
          document.getElementById("peerVideo").remove();
          //   document.getElementById("muteText").remove();
          if (client.peer) {
            client.peer.destroy();
          }
        }
        function reloadPage() {
          console.log("Reloaded");
          window.location.reload();
        }
        socket.on("BackOffer", FrontAnswer);
        socket.on("BackAnswer", SignalAnswer);
        socket.on("SessionActive", SessionActive);
        socket.on("CreatePeer", MakePeer);
        socket.on("Disconnect", RemovePeer);
        socket.on("reload", reloadPage);
      })
      .catch(err => document.write(err));

    console.log("Own Video Started");

    //create a socket connection

    //ends the function for useEffect hook

    //
  }, []);

  return (
    <Fragment>
      <div className="container">
        <div className="row h-100 w-100">
          <p>Gekk</p>
          <div className="col-6 col-6 d-flex justify-content-center">
            <div className="embed-responsive embed-responseive-16by9">
              <video className="embed-responsive-item" muted />
              {/* We muted the above video as we dont want to hear our own voice  also the above raios and sizes fix the video to cover the entire screen*/}
            </div>
          </div>
        </div>
        <div className="row h-100 w-100">
          <div className="col-6 col-6 d-flex justify-content-center">
            <div
              id="peerVideo"
              className="embed-responsive embed-responseive-16by9"
            >
              {/* We muted the above video as we dont want to hear our own voice  also the above raios and sizes fix the video to cover the entire screen*/}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Videochat;

// import React, { Component } from "react";
// // import socketIOClient from "socket.io-client";

// // class Videochatroom extends Component {
// //   constructor() {
// //     super();
// //     this.state = {
// //       response: false,
// //       endpoint: "http://127.0.0.1:5000"
// //     };
// //   }
// //   componentDidMount() {
// //     const { endpoint } = this.state;
// //     const socket = socketIOClient(endpoint);
// //     socket.on("SetupMsg", data => {
// //       this.setState({ response: data });
// //       console.log(data);
// //     });
// //   }
// //   render() {
// //     const { response } = this.state;
// //     return (
// //       <div style={{ textAlign: "center" }}>
// //         <p>Responding to : {response}</p>
// //         {response ? (
// //           <p>The temperature in Florence is: {response} °F</p>
// //         ) : (
// //           <p>Loading...</p>
// //         )}
// //       </div>
// //     );
// //   }
// // }
// // export default Videochatroom;

// import React, { Fragment, useState } from "react";
// import socketIOClient from "socket.io-client";
// const Videochatroom = () => {
//   const [socketinfo, setsocketinfo] = useState({
//     response: "false",
//     endpoint: "http://127.0.0.1:5000"
//   });
//   const socket = socketIOClient(socketinfo.endpoint);
//   socket.on("SetupMsg", data => {
//     console.log(data);
//     setsocketinfo({ response: data, endpoint: "http://127.0.0.1:5000" });
//   });
//   return (
//     <Fragment>
//       <div>
//         <p>Hello world {socketinfo.response} </p>
//       </div>
//     </Fragment>
//   );
// };

// export default Videochatroom;
