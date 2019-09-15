// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

import { ReactInstance, Surface } from "react-360-web";
// import { NativeModules } from "react-360";

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    ...options
  });

  const myFlatSurface = new Surface(
    2800,
    600,
    Surface.SurfaceShape.SurfaceShape
  );
  myFlatSurface.setAngle(0, 0, 0);
  myFlatSurface.setOpacity(0.9);

  r360.compositor.registerSurface("myVideoSurface", myFlatSurface);
  // const videoPlayerSurface = new Surface(1000, 600, Surface.SurfaceShape.Flat);
  // videoPlayerSurface.setAngle(0, 0, 0);
  // r360.compositor.registerSurface("videoPlayerSurface", videoPlayerSurface);

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot("myapp", {
      /* initial props */
    }),
    // r360.getDefaultSurface()
    myFlatSurface
  );

  // Load the initial environment
  // r360.compositor.setBackground(r360.getAssetURL("360_world.jpg"));
}

window.React360 = { init };
