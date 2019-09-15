const express = require("express");
const router = express.Router();
const bodyPix = require("@tensorflow-models/body-pix");
// router.get("/test", (req, res) => {
//   async function loadAndUseBodyPix() {
//     const net = await bodyPix.load();
//     // BodyPix model loaded
//   }
//   res.json({
//     msg: "Microservice works"
//   });
// });
router.post("/test", (req, res) => {
  console.log("Reached here");
  console.log(req.body);
  res.json({
    msg: "Worls"
  });
  // if (req.body.name == "Harsh") {
  //   res.json({
  //     msg: "Microservice works"
  //   });
  // } else {
  //   res.json({
  //     msg: "Microservice doesn't work"
  //   });
  // }
});
module.exports = router;
