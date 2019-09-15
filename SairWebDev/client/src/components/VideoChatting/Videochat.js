import React, { Fragment, useState, useEffect } from "react";
import Peer from "simple-peer";
import socketIOClient from "socket.io-client";
import "./videochatstyles.css";

let client = {};
var peer;
const Videochat = () => {
  const [clientInfo, setClientInfo] = useState({
    clientID: -1
  });

  var str = null;
  var clientID;
  const socket = socketIOClient("http://10.25.66.206:5000");

  //   var peer = new Peer({
  //     initiator: true,
  //     trickle: false
  //     //   stream: stream
  //   });
  useEffect(() => {
    console.log("Enrered");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        console.log("ACCESSING");
        document.getElementById("getInfo").addEventListener("click", () => {
          document.querySelector("#yourID").value = "";
          var id = Math.floor(Math.random() * 999999);
          // console.log(id);
          document.getElementById("clientID").textContent = "ClientID: " + id;

          peer = new Peer({
            initiator: window.location.hash === "#init",
            trickle: false,
            stream: stream
          });

          peer.on("error", function(err) {
            console.log("error", err);
          });

          peer.on("signal", function(data) {
            console.log("SIGNAL", JSON.stringify(data));
            document.querySelector("#yourID").value = JSON.stringify(data);
          });

          peer.on("data", data => {
            console.log("HEL" + data);
            document.getElementById("reading").value = data;
          });

          peer.on("stream", stream => {
            var vid = document.getElementById("peervid");
            vid.srcObject = stream;
            vid.play();
          });
        });

        document
          .getElementById("createConnection")
          .addEventListener("click", () => {
            var otherID = JSON.parse(
              document.getElementById("connectingID").value
            );
            console.log(peer);
            // console.log
            peer.signal(otherID);
          });
      });
  });
  const onsubmit = async e => {
    e.preventDefault();
    document.querySelector("#yourID").value = "";
    var id = Math.floor(Math.random() * 999999);
    // console.log(id);
    document.getElementById("clientID").textContent = "ClientID: " + id;

    // var text = document.getElementById("connectingID").textContent;

    peer = new Peer({
      initiator: window.location.hash === "#init",
      trickle: false
      //   stream: stream
    });

    console.log(peer);
    peer.on("error", function(err) {
      console.log("error", err);
    });

    peer.on("signal", function(data) {
      console.log("SIGNAL", JSON.stringify(data));
      document.querySelector("#yourID").value = JSON.stringify(data);
    });

    peer.on("data", data => {
      console.log("HEL" + data);
      document.getElementById("reading").value = data;
    });

    peer.on("stream", stream => {
      var vid = document.getElementById("peervid");
      vid.srcObject = stream;
      vid.onplay();
    });
  };

  const startChat = async e => {
    e.preventDefault();
    var otherID = JSON.parse(document.getElementById("connectingID").value);
    console.log(peer);
    // console.log
    peer.signal(otherID);
  };

  const sendTextMessage = async e => {
    e.preventDefault();
    var message = document.getElementById("message").value;
    peer.send(message);
  };
  //   const startVideoChat = async e => {
  //     e.preventDefault();
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: true })
  //       .then(stream => {
  //         document.querySelector("#yourID").value = "";
  //         var id = Math.floor(Math.random() * 999999);
  //         // console.log(id);
  //         document.getElementById("clientID").textContent = "ClientID: " + id;

  //         // var text = document.getElementById("connectingID").textContent;
  //         // var peer = new Peer({
  //         //   initiator: window.location.hash === "#init",
  //         //   trickle: false,
  //         //   stream: stream
  //         // });
  //       });
  //     peer.on("stream", stream => {
  //       var vid = document.getElementById("peervid");
  //       vid.srcObj = stream;
  //       vid.play();
  //     });
  //   };

  return (
    <Fragment>
      {/* <button onClick={() => handleNewMessage()}>Emit new message</button> */}
      <div>
        <form className="form">
          {/* onSubmit={e => onsubmit(e)}> */}
          <input
            // type="submit"
            id="getInfo"
            className="btn btn-primary"
            value="Get Info"
            required
          />
        </form>
        <form className="form">
          {/* onSubmit={e => startChat(e)} */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter the ID to connect with your friend"
              name="name"
              id="connectingID"
              required
            />
          </div>
          <div className="form-group">
            <label id="clientID">Your ID: </label>
          </div>
          <div className="form-group">
            <label id="IDPeer">Your Token: </label>
            <textarea class="form-control" rows="5" id="yourID" />
          </div>

          <input
            className="btn btn-primary"
            value="Create Connection"
            id="createConnection"
            required
          />
        </form>

        <form className="form" onSubmit={e => sendTextMessage(e)}>
          <div className="form-group">
            <label id="messageLabel">Write Your Message: </label>
            <textarea class="form-control" rows="5" id="message" />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Send Text Message"
            required
          />
        </form>
        <form className="form">
          <input
            type="submit"
            className="btn btn-primary"
            value="Start Video Chat"
            required
          />
        </form>
      </div>

      {/* <div className="container parent-box row ">
        <div className="col-sm-4 d-flex justify-content-center video-box" />{" "}
        <div className="col-sm-4 d-flex justify-content-center video-box" />
      </div> */}

      <div id="msgbox" class="message-box">
        <textarea class="form-control" rows="5" id="reading" />
      </div>
      <div id="block_container">
        <div className="video-box">
          <video id="peervid" />
        </div>
        <div className="video-box">
          <video />
        </div>
      </div>
    </Fragment>
  );
};

export default Videochat;
