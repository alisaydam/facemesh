// Install dependencies - DONE
// Import dependencies - DONE
// Setup webcam and canvas - DONE
// Define refrences to those - DONE
// Load facemesh - DONE
// Detect function - DONE
// Drawing utilities
// Load triangualation
// Setup triangle path
// Setup point drawing
// Add drawMesh  to detect function

import "./App.css";
import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  // Setup Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load FaceMesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {
        with: 640,
        height: 480,
      },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net);
    }, 250);
  };
  // console.log(canvasRef.current);
  // Detect function
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const face = await net.estimateFaces(video);
      // console.log(face);
      // Get canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };

  runFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
      </header>
    </div>
  );
}

export default App;
