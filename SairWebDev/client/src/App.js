import React, { Fragment } from "react";
import "./App.css";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import VideoSeg from "./components/videosegmentation/videosegmentation";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
// import videochat from "./components/videosegmentation/Videochat";
import videochat from "./components/VideoChatting/Videochat";
import screenrecorder from "./components/VideoChatting/ScreenRecord";
import videochatseg from "./components/VideoChatting/VideochatWSeg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path="/videoseg" component={VideoSeg} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/videochat" component={videochat} />
          <Route exact path="/screenrecord" component={screenrecorder} />
          <Route exact path="/videochatseg" component={videochatseg} />
        </Switch>
      </section>
    </Fragment>
  </Router>
);
// Fragment is like a ghost component
export default App;
