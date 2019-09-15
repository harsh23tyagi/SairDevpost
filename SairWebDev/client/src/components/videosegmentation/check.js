// import React, { Fragment, useState } from "react";
// import socketIOClient from "socket.io-client";

// const EndpointInfo = ()=>{
//     const [info, setinfo] = useState({
//         response: false,
//         endpoint: "localhost:5000"
//     })
// }

// const videochat = () => {
//     componentDidMount() {
//         const { endpoint } = this.state;
//         const socket = socketIOClient(endpoint);
//         socket.on("FromAPI", data => this.setState({ response: data }));
//       }
//   return (
//     <Fragment>
//       <h1>Video Chat App</h1>
//       <div className="container-fluid">
//         <div className="row h-100 w-100">
//           {/* First Person Video */}
//           <div className="col-12 col-sm-6 d-flex justify-content-center">
//             <div className="embed-responsive embed-respnsive-16by9">
//               <video src="" className="embed-responsive-item" muted />
//             </div>
//           </div>
//           {/* Second Person's Video created dynamically */}
//           <div className="col-12 col-sm-6 d-flex justify-content-center">
//             <div className="embed-responsive embed-respnsive-16by9">
//               {/* Video element will be generated dynamically */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// // const exportVid = withState("response", "endpoint")(videochat);

// export default videochat;
