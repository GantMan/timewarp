import React, { useEffect, useRef, useState } from "react"
import * as tf from "@tensorflow/tfjs"

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * This is hacky, and we'll want to re-architect this before getting too far.
 * What we really need is a single model (MST?) with all the state and which hangs
 * onto volatile things like refs, and manages all of the media state.
 *
 * But for now, we're just externally storing the props as a singleton and ensuring
 * that it's updated anytime the function re-renders.
 */
const externalProps = {
  currentProps: {},
}

export default function Scancam(props) {
  externalProps.currentProps = props

  // Media refs
  const mysteryRef = useRef(null)
  const playbackRef = useRef(null)
  const detectionRef = useRef(null)
  const resultRef = useRef(null)
  const barRef = useRef(null)
  const compositeRef = useRef(null)
  const linkRef = useRef(null)
  const videoLinkRef = useRef(null)
  const [currentVideo, setCurrentVideo] = useState(null)

  // Media stream
  const [localStream, setLocalStream] = useState(null)

  // Scanner state
  const [scanning, setScanning] = externalProps.currentProps.scanning
  const [clear, setClear] = externalProps.currentProps.clear
  const [saveResult, setSaveResult] = externalProps.currentProps.saveResult

  // Some local state
  let counter = 0
  let warped, mediaRecorder, videoURL

  // Creates a new media recorder & starts the recording stream
  function startRecording() {
    // 30fps video
    const compositeStream = compositeRef.current.captureStream(30)
    mediaRecorder = new MediaRecorder(compositeStream)

    let chunks = []
    mediaRecorder.onstop = function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" })
      chunks = []
      const video = playbackRef.current
      videoURL = URL.createObjectURL(blob)
      video.src = videoURL
      setCurrentVideo(videoURL)
    }
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.start()
  }

  // Clears the drawing context
  function clearResult() {
    const resultCtx = resultRef.current.getContext("2d")
    resultCtx.clearRect(0, 0, resultCtx.canvas.width, resultCtx.canvas.height)
    // prep scanline
    detectionRef.current.style.display = "inline-block"
    setClear(false)
  }

  // Subscribes to webcam stream and sets up canvas
  async function setupWebcam() {
    const videoRef = mysteryRef.current
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      })

      setLocalStream(webcamStream)

      // backwards compat
      if ("srcObject" in videoRef) {
        videoRef.srcObject = webcamStream
      } else {
        videoRef.src = window.URL.createObjectURL(webcamStream)
      }

      videoRef.onloadedmetadata = () => {
        // Prep Canvas
        const detection = detectionRef.current
        const resultCanv = resultRef.current
        const composite = compositeRef.current
        // modify padding/width
        const imgWidth =
          (videoRef.videoWidth / videoRef.videoHeight) * videoRef.clientHeight
        const leftAdjust = (videoRef.clientWidth - imgWidth) / 2 + 10 // 10 for pixel padding

        const imgHeight = videoRef.clientHeight
        detection.width = imgWidth
        detection.height = imgHeight
        detection.style.left = `${leftAdjust}px`
        resultCanv.width = imgWidth
        resultCanv.height = imgHeight
        resultCanv.style.left = `${leftAdjust}px`
        composite.width = imgWidth
        composite.height = imgHeight
      }
    } else {
      alert("No webcam - sorry!")
    }
  }

  function closeWebcam() {
    if (localStream) {
      localStream.getTracks()[0].stop()
    }
  }

  // Recursive function that scans each line on the webcam
  async function scanLine() {
    const videoRef = mysteryRef.current
    const ctx = detectionRef.current.getContext("2d")
    const chunkSize = 2 ** externalProps.currentProps.scanSize
    const direction = externalProps.currentProps.direction
    const numChannels = externalProps.currentProps.color ? 3 : 1

    // Slow scan on fast computers
    await sleep(externalProps.currentProps.scanBreaks * 10)

    const cut = tf.tidy(() => {
      const myTensor = tf.browser.fromPixels(videoRef, numChannels)
      let resizedTensor = tf.image
        .resizeBilinear(
          myTensor,
          [ctx.canvas.clientHeight, ctx.canvas.clientWidth],
          true
        )
        .div(255)
      if (externalProps.currentProps.mirror)
        resizedTensor = resizedTensor.reverse(1)
      // Never overslice
      const calculatedChunk =
        counter + chunkSize > resizedTensor.shape[direction]
          ? resizedTensor.shape[direction] - counter
          : chunkSize
      // Adjust cut for axis
      const startPos = [0, 0, 0]
      startPos[direction] = counter
      const cutShape = [
        ctx.canvas.clientHeight,
        ctx.canvas.clientWidth,
        numChannels,
      ]
      cutShape[direction] = calculatedChunk
      return tf.slice(resizedTensor, startPos, cutShape)
    })
    await tf.browser.toPixels(cut, barRef.current)
    // Concat or create tensor
    let newWarp
    if (counter > 0) {
      newWarp = tf.concat([warped, cut], direction)
      tf.dispose([cut, warped])
    } else {
      newWarp = cut
    }
    warped = newWarp
    // clear everything each round
    let endCount
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.shadowColor = "red"
    ctx.shadowBlur = 5
    ctx.strokeStyle = "#0F0C"
    ctx.lineWidth = chunkSize
    ctx.beginPath()
    const resultCtx = resultRef.current.getContext("2d")
    if (direction < 1) {
      // draw slice
      resultCtx.drawImage(barRef.current, 0, counter)
      // draw line
      ctx.moveTo(0, counter)
      ctx.lineTo(ctx.canvas.width, counter)
      endCount = ctx.canvas.height
    } else {
      // draw slice
      resultCtx.drawImage(barRef.current, counter, 0)
      // draw line
      ctx.moveTo(counter, 0)
      ctx.lineTo(counter, ctx.canvas.height)
      endCount = ctx.canvas.width
    }
    ctx.stroke()
    // increase counter
    counter += chunkSize
    // start composite
    const compositeCtx = compositeRef.current.getContext("2d")
    compositeCtx.save()
    if (externalProps.currentProps.mirror) {
      compositeCtx.translate(compositeRef.current.width, 0)
      compositeCtx.scale(-1, 1)
    }
    compositeCtx.drawImage(
      videoRef,
      0,
      0,
      ctx.canvas.clientWidth,
      ctx.canvas.clientHeight
    )
    compositeCtx.restore()
    compositeCtx.drawImage(resultRef.current, 0, 0)
    compositeCtx.drawImage(detectionRef.current, 0, 0)
    if (counter < endCount) {
      requestAnimationFrame(() => {
        scanLine()
      })
    } else if (externalProps.currentProps.loops) {
      counter = 0
      warped.dispose()
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      requestAnimationFrame(() => {
        scanLine()
      })
    } else {
      // stop recording
      setTimeout(function () {
        mediaRecorder && mediaRecorder.stop()
      }, 2000)

      // cleanup
      warped.dispose()
      detectionRef.current.style.display = "none"
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      setScanning("scanned")
      console.log("DONE", tf.memory().numTensors)
    }
  }

  // Downloads a PNG
  function savePNGResult() {
    const link = videoLinkRef.current
    link.setAttribute("download", "TimeWarpScanMe.png")
    link.setAttribute(
      "href",
      resultRef.current
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    )
    link.click()
    setSaveResult(false)
  }

  // Downloads MP4 of the recorded process
  function saveMP4Result() {
    const videoLink = videoLinkRef.current
    console.log("video URL", currentVideo)
    videoLink.setAttribute("download", "TimeWarpScanMe.mp4")
    videoLink.setAttribute("href", currentVideo)
    videoLink.click()
  }

  // Kicks off the scanning process and recording
  async function startScan() {
    await sleep(externalProps.currentProps.delayStart * 1000)
    if (externalProps.currentProps.record) startRecording()
    counter = 0
    // clear previous
    clearResult()
    // start scan
    scanLine()
  }

  useEffect(() => {
    if (!localStream) setupWebcam()
    return closeWebcam
  }, [localStream])

  useEffect(() => {
    if (scanning === true) startScan()
  }, [scanning])

  useEffect(() => {
    if (clear) {
      setScanning(false)
      clearResult()
    }
  }, [clear])

  useEffect(() => {
    if (saveResult === "PNG") savePNGResult()
    if (saveResult === "MP4") saveMP4Result()
  }, [saveResult, currentVideo])

  return (
    <div className="camContainer">
      <video
        ref={mysteryRef}
        id="mystery"
        width="100%"
        autoPlay
        style={{
          transform: `scaleX(${externalProps.currentProps.mirror ? "-1" : "1"}`,
        }}
      ></video>
      <canvas ref={resultRef} id="result"></canvas>
      <canvas ref={detectionRef} id="detection"></canvas>
      <div>
        <canvas
          ref={compositeRef}
          id="composite"
          style={{ display: "none" }}
        ></canvas>
        <canvas ref={barRef} id="bar" style={{ display: "none" }}></canvas>
        <a ref={linkRef} id="link"></a>
        <a ref={videoLinkRef} id="videoLink"></a>
      </div>
      <div id="playbackVideo" className="modal">
        <div className="modal__content">
          <video
            ref={playbackRef}
            id="playback"
            controls
            loop
            //style={{ display: 'none' }}
          ></video>
          <a href="#" className="modal__close">
            &times;
          </a>
        </div>
      </div>
    </div>
  )
}
