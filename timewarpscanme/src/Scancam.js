import React, { useEffect, useRef, useState } from 'react'

export default function (props) {
  const mysteryRef = useRef(null)
  const detectionRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [scanning, setScanning] = props.scanning

  async function setupWebcam() {
    const videoRef = mysteryRef.current
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
        },
      })

      setLocalStream(webcamStream)

      // backwards compat
      if ('srcObject' in videoRef) {
        videoRef.srcObject = webcamStream
      } else {
        videoRef.src = window.URL.createObjectURL(webcamStream)
      }

      videoRef.onloadedmetadata = () => {
        // Prep Canvas
        const detection = detectionRef.current
        const imgWidth = videoRef.clientWidth
        const imgHeight = videoRef.clientHeight
        detection.width = imgWidth
        detection.height = imgHeight
        // const ctx = detection.getContext("2d");
        // [ctx, imgHeight, imgWidth];
      }
    } else {
      alert('No webcam - sorry!')
    }
  }

  function closeWebcam() {
    if (localStream) {
      localStream.getTracks()[0].stop()
    }
  }

  function startScan() {
    alert('Starting scan ' + scanning)
    setTimeout(() => {
      setScanning(false)
      alert('scanning complete')
    }, 5000)
  }

  useEffect(() => {
    if (!localStream) setupWebcam()
    return closeWebcam
  }, [localStream])

  useEffect(() => {
    if (scanning) startScan()
  }, [scanning])

  return (
    <div className="camContainer">
      <video
        ref={mysteryRef}
        id="mystery"
        width="100%"
        autoPlay
        style={{ transform: `scaleX(${props.mirror ? '-100%' : '100%'}` }}
      ></video>
      <canvas id="result"></canvas>
      <canvas ref={detectionRef} id="detection"></canvas>
    </div>
  )
}
