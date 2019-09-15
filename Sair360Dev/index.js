import React from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Pano,
  NativeModules,
  VrButton,
  Environment
} from "react-360";
import { Module } from "react-360-web";

class CustomLinkingModule extends Module {
  constructor() {
    super("CustomLinkingModule");
  }

  openInNewTab(url) {
    window.open(url, "_blank");
  }
}

// import { NativeModules } from "react-360";
// const Linking = NativeModules.LinkingManager;
const { VideoModule } = NativeModules;
var Dropbox = require("dropbox");
export default class myapp extends React.Component {
  createMyPlayer() {
    VideoModule.createPlayer("myplayer");
  }

  downloadFile() {
    const ACCESS_TOKEN =
      "K6sZ562dgAAAAAAAAAABRYisflps8rAMTcfDvlUsqZGkt022Sgks1sRJuvZLO5JV";
    const SHARED_LINK =
      "https://www.dropbox.com/s/327g2vtv4xzik9m/hty.json?dl=1";
    NativeModules.LinkingManager.openURL(SHARED_LINK);
    // var object = new ActiveXObject("Scripting.FileSystemObject");

    // file.Move("C:\\wamp\\");
    // document.write("File is moved successfully");

    // var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
    // dbx
    //   .sharingGetSharedLinkFile({ url: SHARED_LINK })
    //   .then(function(data) {
    //     console.log("Data Received");
    //     var downloadUrl = URL.createObjectURL(data.fileBlob);
    //     var downloadButton = document.createElement("a");
    //     downloadButton.setAttribute("href", downloadUrl);
    //     downloadButton.setAttribute("download", data.name);
    //     downloadButton.setAttribute("class", "button");
    //     downloadButton.innerText = "Download: " + data.name;
    //     document.getElementById("results").appendChild(downloadButton);
    //   })
    //   .catch(function(error) {
    //     console.error(error);
    //   });
  }

  playSurface() {
    VideoModule.play("myplayer", {
      source: { url: "static_assets/360video.mp4" },
      muted: false
    });

    //default if we have more than one screen-param1
    // name of the player param2
    // name of the surface- we can make custom surface - param3
    // pixel values

    Environment.setScreen(
      "default",
      "myplayer",
      "myVideoSurface",
      800,
      0,
      300,
      100
    );
  }
  render() {
    return (
      <View>
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>
            Welcome to Sair- Immersive Video Chat Platform
          </Text>
        </View>
        <View>
          <VrButton onClick={() => this.createMyPlayer()}>
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>CREATE VIDEO PLAYER</Text>
            </View>
          </VrButton>
        </View>
        <View>
          <VrButton onClick={() => this.playSurface()}>
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>START VIDEO</Text>
            </View>
          </VrButton>
        </View>
        <View>
          <VrButton onClick={() => this.downloadFile()}>
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>Download File</Text>
            </View>
          </VrButton>
        </View>
        <View
          onInput={e => {
            const event = e.nativeEvent; // Extract the value from the runtime
            // event contains the actual event payload, as well as information on
            // which cursor the user was using, and which React tag was targeted
            const inputEvent = event.inputEvent; // Extract the payload
            // inputEvent.button is the raw button index, used to determine what was pressed
            // inputEvent.buttonClass is a field added to some buttons for common actions,
            //   like 'confirm', 'back', 'up', 'down', etc.
            // inputEvent.action is 'up', 'down', or 'repeat'
            // inputEvent.source identifies the button device, such as keyboard, mouse, etc
            console.log(inputEvent);
          }}
        >
          {/* ... */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  greetingBox: {
    padding: 20,
    backgroundColor: "#000000",
    borderColor: "#639dda",
    borderWidth: 2
  },
  greeting: {
    fontSize: 30
  }
});

AppRegistry.registerComponent("myapp", () => myapp);
