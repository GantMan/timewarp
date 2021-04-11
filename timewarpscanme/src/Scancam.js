import React, { useEffect, useRef } from "react";

export default function (props) {
  const mysteryRef = useRef(null);
  const detectionRef = useRef(null);

  async function setupWebcam() {
    const videoRef = mysteryRef.current
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      });

      // backwards compat
      if ("srcObject" in videoRef) {
        videoRef.srcObject = webcamStream;
      } else {
        videoRef.src = window.URL.createObjectURL(webcamStream);
      }


      videoRef.onloadedmetadata = () => {
        // Prep Canvas
        const detection = detectionRef.current;
        const imgWidth = videoRef.clientWidth;
        const imgHeight = videoRef.clientHeight;
        detection.width = imgWidth;
        detection.height = imgHeight;
        // const ctx = detection.getContext("2d");
        // [ctx, imgHeight, imgWidth];
      };

    } else {
      alert("No webcam - sorry!");
    }
  }

  useEffect(() => {
    setupWebcam()
  });

  return (
    <div className="camContainer">
      <video ref={mysteryRef} id="mystery" width="100%" autoPlay></video>
      <canvas id="result"></canvas>
      <canvas ref={detectionRef} id="detection"></canvas>
    </div>
  );
}
