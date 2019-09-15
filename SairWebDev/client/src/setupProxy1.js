// const proxy = require("http-proxy-middleware");
// module.exports = function(app) {
//   app.use(proxy("/*", { target: "http://localhost:5000/", secure: false }));
//   app.use(
//     proxy("/videochat/*", {
//       target: "http://localhost:3000",
//       secure: false,
//       changeOrigin: true
//     })
//   );
//   //   app.use(
//   //     proxy("/videochat", { target: "http://localhost:5000/", secure: false })
//   //
// };

const proxy = require("http-proxy-middleware");

module.exports = app => {
  //   app.use(
  //     proxy("/videochat", {
  //       target: "http://localhost:3000",
  //       ws: true
  //       //   pathRewrite: {
  //       //     "^/videochat": "/" // rewrite path
  //       //   }
  //     })
  //   );
};
