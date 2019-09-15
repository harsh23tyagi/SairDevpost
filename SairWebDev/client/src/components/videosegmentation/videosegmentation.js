import React from "react";
// import axios from "axios";
// import img from "./image1.jpg";
import * as bodyPix from "@tensorflow-models/body-pix";
import "../../Self.css";
import * as partColorScales from "./color_scheme";
// New Imports for videoSegmentation
import dat from "dat.gui";
import Stats from "stats.js";

//End of imports

// ------Begin coding video demo------

const stats = new Stats();
const state = {
  video: null,
  strem: null,
  net: null,
  videoConstraints: {},
  changingCamera: false,
  changingArchitecture: false
};

//Checking the type of device: Mobile or not- if mobile then android or IoS
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

async function getVideoInputs() {
  console.log("Checking Devices");
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
    return [];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();

  const videoDevices = devices.filter(device => device.kind === "videoinput");
  console.log(videoDevices);
  return videoDevices;
}

function stopExistingVideoCapture() {
  if (state.video && state.video.srcObject) {
    state.video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    state.video.srcObject = null;
  }
}

async function getDeviceIdForLabel(cameraLabel) {
  // event.preventDefault(); //remove this line whenever you want to load the next page
  const videoInputs = await getVideoInputs();
  console.log("CamerLabel" + cameraLabel);
  for (let i = 0; i < videoInputs.length; i++) {
    const videoInput = videoInputs[i];
    if (videoInput.label === cameraLabel) {
      console.log("Camera Found: ");
      console.log(videoInput);
      console.log(videoInput.label);
      return videoInput.deviceId;
    }
  }

  return null;
}

function getFacingMode(cameraLabel) {
  if (!cameraLabel) {
    return "user";
  }
  if (cameraLabel.toLowerCase().includes("back")) {
    return "environment";
  } else {
    return "user";
  }
}

async function getConstraints(cameraLabel) {
  let deviceId;
  let facingMode;

  if (cameraLabel) {
    deviceId = await getDeviceIdForLabel(cameraLabel);
    // on mobile, use the facing mode based on the camera.
    facingMode = isMobile() ? getFacingMode(cameraLabel) : null;
  }
  return { deviceId, facingMode };
}

async function setupCamera(cameraLabel) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const videoElement = document.getElementById("video");

  stopExistingVideoCapture();

  const videoConstraints = await getConstraints(cameraLabel);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: videoConstraints
  });
  videoElement.srcObject = stream;

  return new Promise(resolve => {
    videoElement.onloadedmetadata = () => {
      videoElement.width = videoElement.videoWidth;
      videoElement.height = videoElement.videoHeight;
      resolve(videoElement);
    };
  });
}

async function loadVideo(cameraLabel) {
  try {
    state.video = await setupCamera(cameraLabel);
  } catch (e) {
    let info = document.getElementById("info");
    info.textContent =
      "this browser does not support video capture," +
      "or this device does not have a camera";
    info.style.display = "block";
    throw e;
  }

  state.video.play();
}

const guiState = {
  estimate: "segmentation",
  camera: null,
  flipHorizontal: true,
  input: {
    mobileNetArchitecture: isMobile() ? "0.50" : "0.75",
    outputStride: 16
  },
  segmentation: {
    segmentationThreshold: 0.5,
    effect: "mask",
    maskBackground: true,
    opacity: 0.7,
    backgroundBlurAmount: 3,
    maskBlurAmount: 0,
    edgeBlurAmount: 3
  },
  partMap: {
    colorScale: "rainbow",
    segmentationThreshold: 0.5,
    applyPixelation: false,
    opacity: 0.9
  },
  showFps: !isMobile()
};

function toCameraOptions(cameras) {
  const result = { default: null };

  cameras.forEach(camera => {
    result[camera.label] = camera.label;
  });

  return result;
}

// Setting up GUI
function setupGui(cameras) {
  const gui = new dat.GUI({ width: 300 });

  gui
    .add(guiState, "camera", toCameraOptions(cameras))
    .onChange(async function(cameraLabel) {
      state.changingCamera = true;

      await loadVideo(cameraLabel);

      state.changingCamera = false;
    });

  gui.add(guiState, "flipHorizontal");

  // Architecture: there are a few BodyPix models varying in size and
  // accuracy. 1.00 is the largest, but will be the slowest. 0.25 is the
  // fastest, but least accurate.
  gui
    .add(guiState.input, "mobileNetArchitecture", [
      "1.00",
      "0.75",
      "0.50",
      "0.25"
    ])
    .onChange(async function(architecture) {
      state.changingArchitecture = true;
      // Important to purge variables and free
      // up GPU memory
      state.net.dispose();

      // Load the PoseNet model weights for
      // either the 0.50, 0.75, 1.00, or 1.01
      // version
      state.net = await bodyPix.load(+architecture);

      state.changingArchitecture = false;
    });

  // Output stride:  Internally, this parameter affects the height and width
  // of the layers in the neural network. The lower the value of the output
  // stride the higher the accuracy but slower the speed, the higher the value
  // the faster the speed but lower the accuracy.
  gui.add(guiState.input, "outputStride", [8, 16, 32]);

  const estimateController = gui.add(guiState, "estimate", [
    "segmentation",
    "partmap"
  ]);

  let segmentation = gui.addFolder("Segmentation");
  segmentation.add(guiState.segmentation, "segmentationThreshold", 0.0, 1.0);
  const segmentationEffectController = segmentation.add(
    guiState.segmentation,
    "effect",
    ["mask", "bokeh"]
  );

  segmentation.open();

  let darknessLevel;
  let bokehBlurAmount;
  let edgeBlurAmount;
  let maskBlurAmount;
  let maskBackground;

  segmentationEffectController.onChange(function(effectType) {
    if (effectType === "mask") {
      if (bokehBlurAmount) {
        bokehBlurAmount.remove();
      }
      if (edgeBlurAmount) {
        edgeBlurAmount.remove();
      }
      darknessLevel = segmentation.add(
        guiState.segmentation,
        "opacity",
        0.0,
        1.0
      );
      maskBlurAmount = segmentation
        .add(guiState.segmentation, "maskBlurAmount")
        .min(0)
        .max(20)
        .step(1);
      maskBackground = segmentation.add(
        guiState.segmentation,
        "maskBackground"
      );
    } else if (effectType === "bokeh") {
      if (darknessLevel) {
        darknessLevel.remove();
      }
      if (maskBlurAmount) {
        maskBlurAmount.remove();
      }
      if (maskBackground) {
        maskBackground.remove();
      }
      bokehBlurAmount = segmentation
        .add(guiState.segmentation, "backgroundBlurAmount")
        .min(1)
        .max(20)
        .step(1);
      edgeBlurAmount = segmentation
        .add(guiState.segmentation, "edgeBlurAmount")
        .min(0)
        .max(20)
        .step(1);
    }
  });

  // manually set the effect so that the options are shown.
  segmentationEffectController.setValue(guiState.segmentation.effect);

  let partMap = gui.addFolder("Part Map");
  partMap.add(guiState.partMap, "segmentationThreshold", 0.0, 1.0);
  partMap.add(guiState.partMap, "applyPixelation");
  partMap.add(guiState.partMap, "opacity", 0.0, 1.0);
  partMap
    .add(guiState.partMap, "colorScale", Object.keys(partColorScales))
    .onChange(colorScale => {
      setShownPartColorScales(colorScale);
    });
  setShownPartColorScales(guiState.partMap.colorScale);

  estimateController.onChange(function(estimationType) {
    if (estimationType === "segmentation") {
      segmentation.open();
      partMap.close();
      document.getElementById("colors").style.display = "none";
    } else {
      segmentation.close();
      partMap.open();
      document.getElementById("colors").style.display = "inline-block";
    }
  });

  gui.add(guiState, "showFps").onChange(showFps => {
    if (showFps) {
      document.body.appendChild(stats.dom);
    } else {
      document.body.removeChild(stats.dom);
    }
  });
}

function setShownPartColorScales(colorScale) {
  const colors = document.getElementById("colors");
  colors.innerHTML = "";

  const partColors = partColorScales[colorScale];
  const partNames = bodyPix.partChannels;

  for (let i = 0; i < partColors.length; i++) {
    const partColor = partColors[i];
    const child = document.createElement("li");

    child.innerHTML = `
        <div class='color' style='background-color:rgb(${partColor[0]},${
      partColor[1]
    },${partColor[2]})' ></div>
        ${partNames[i]}`;

    colors.appendChild(child);
  }
}
//--GUI Setup Ends--

// ---Seting up FPS--
/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  if (guiState.showFps) {
    document.body.appendChild(stats.dom);
  }
}

//Body Segmentation in real time
function segmentBodyInRealTime() {
  const canvas = document.getElementById("output");
  // since images are being fed from a webcam

  async function bodySegmentationFrame() {
    // if changing the model or the camera, wait a second for it to complete
    // then try again.
    if (state.changingArchitecture || state.changingCamera) {
      setTimeout(bodySegmentationFrame, 1000);
      return;
    }

    // Begin monitoring code for frames per second
    stats.begin();

    // Scale an image down to a certain factor. Too large of an image will
    // slow down the GPU
    const outputStride = +guiState.input.outputStride;

    const flipHorizontally = guiState.flipHorizontal;

    switch (guiState.estimate) {
      case "segmentation":
        const personSegmentation = await state.net.estimatePersonSegmentation(
          state.video,
          outputStride,
          guiState.segmentation.segmentationThreshold
        );

        switch (guiState.segmentation.effect) {
          case "mask":
            const mask = bodyPix.toMaskImageData(
              personSegmentation,
              guiState.segmentation.maskBackground
            );
            bodyPix.drawMask(
              canvas,
              state.video,
              mask,
              guiState.segmentation.opacity,
              guiState.segmentation.maskBlurAmount,
              flipHorizontally
            );

            break;
          case "bokeh":
            bodyPix.drawBokehEffect(
              canvas,
              state.video,
              personSegmentation,
              +guiState.segmentation.backgroundBlurAmount,
              guiState.segmentation.edgeBlurAmount,
              flipHorizontally
            );
            break;
        }
        break;
      case "partmap":
        const partSegmentation = await state.net.estimatePartSegmentation(
          state.video,
          outputStride,
          guiState.partMap.segmentationThreshold
        );

        const coloredPartImageData = bodyPix.toColoredPartImageData(
          partSegmentation,
          partColorScales[guiState.partMap.colorScale]
        );

        const maskBlurAmount = 0;
        if (guiState.partMap.applyPixelation) {
          const pixelCellWidth = 10.0;

          bodyPix.drawPixelatedMask(
            canvas,
            state.video, //changed here
            coloredPartImageData,
            guiState.partMap.opacity,
            maskBlurAmount,
            flipHorizontally,
            pixelCellWidth
          );
        } else {
          bodyPix.drawMask(
            canvas,
            state.video, //changed here
            coloredPartImageData,
            guiState.opacity,
            maskBlurAmount,
            flipHorizontally
          );
        }

        break;
      default:
        break;
    }

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(bodySegmentationFrame);
  }

  bodySegmentationFrame();
}
//--------End Video Demo-------

const videosegmentation = () => {
  // const loadAndUseBodyPix = async e => {
  //   // async function loadAndUseBodyPix() {
  //   e.preventDefault();
  //   const net = await bodyPix.load();
  //   // BodyPix model loaded
  //   const imageElement = document.getElementById("image");
  //   console.log("Loaded");
  //   // load the BodyPix model from a checkpoint

  //   // arguments for estimating person segmentation.
  //   const outputStride = 16;
  //   const segmentationThreshold = 0.5;

  //   const personSegmentation = await net.estimatePersonSegmentation(
  //     imageElement,
  //     outputStride,
  //     segmentationThreshold
  //   );
  //   console.log(personSegmentation);
  //   console.log("Reached");

  //   console.log("Masking the image");
  //   // Masking the image
  //   const segmentation = await net.estimatePersonSegmentation(imageElement);

  //   const maskBackground = true;
  //   // Convert the personSegmentation into a mask to darken the background.
  //   const backgroundDarkeningMask = bodyPix.toMaskImageData(
  //     personSegmentation,
  //     maskBackground
  //   );

  //   const opacity = 0.7;

  //   const canvas = document.getElementById("canvas");
  //   // draw the mask onto the image on a canvas.  With opacity set to 0.7 this will darken the background.
  //   bodyPix.drawMask(canvas, imageElement, backgroundDarkeningMask, opacity);
  //   console.log("Image Masked");
  //   console.log("Estimating Part Segmentation...");
  //   const partSegmentation = await net.estimatePartSegmentation(
  //     imageElement,
  //     outputStride,
  //     segmentationThreshold
  //   );
  //   console.log("Part Segmentation Results:");
  //   console.log(partSegmentation);
  // };

  const demoKickOff = async e => {
    e.preventDefault();
    state.net = await bodyPix.load(+guiState.input.mobileNetArchitecture);

    // document.getElementById("loading").style.display = "none";
    document.getElementById("main").style.display = "inline-block";

    await loadVideo();

    let cameras = await getVideoInputs();

    setupFPS();
    setupGui(cameras);

    segmentBodyInRealTime();
  };
  return (
    <div className="container">
      {/* --Container Begins-- */}
      <h1 className="headerVidSeg">Video Segmentation</h1>
      {/* <form className="form" onSubmit={e => getVid(e)}>
        <input
          type="submit"
          className="btn btn-primary"
          value="Check Devices"
          required
        />
      </form> */}
      <form className="form" onSubmit={e => demoKickOff(e)}>
        <input
          type="submit"
          className="btn btn-primary"
          value="Get Device Label"
          required
        />
      </form>

      <div id="stats" />
      <div id="info" className="info" />

      <div id="main" className="info">
        <video id="video" className="videoClass" playsInline />
        <canvas id="output" />
      </div>

      <ul id="colors" className="info" />

      <div className="footer">
        <div className="footer-text">
          <p>
            The BodyPix model can estimate which pixels in an image are part of
            a person, and which pixels are part of each of 24 body parts. It
            works on a single person, and such <strong>works best</strong> when{" "}
            <strong>one person is present</strong> in an image.
            <br />
            <br />
            The <strong>output stride</strong> and{" "}
            <strong>model (indicated by mobileNetArchitecture)</strong> have the
            largest effects on accuracy/speed. A <i>higher</i> output stride
            results in lower accuracy but higher speed. A <i>larger</i> model,
            indicated by the <i>mobileNetArchitecture</i> dropdown, results in
            higher accuracy but lower speed.
          </p>
          <div className="footer-menu">
            <i className="material-icons switch-camera">switch_camera</i>
            <i className="material-icons mask mode active">portrait</i>
            <i className="material-icons mode bokeh">blur_on</i>
            <i className="material-icons mode part-map">format_color_fill</i>
            <i className="material-icons high-accuracy">high_quality</i>
          </div>
        </div>
      </div>
      {/* <script src="videosegmentation.js"></script> */}
      {/* --Container Ends-- */}
    </div>
  );
};
console.log("Hello");

console.log("Bigshot");
export default videosegmentation;

// {/* <form className="form" onSubmit={e => loadAndUseBodyPix(e)}>
{
  /* <h1 className="headerVidSeg">Reached Video Segmentation Page</h1>
<div id="divid1">
  <img src={img} id="image" />
</div>

<br />
<input
  type="submit"
  className="btn btn-primary"
  value="Segment Image"
  required
/>
</form>
<br />
<canvas id="canvas" width="100%" />  */
}
