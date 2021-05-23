import React, { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

export default function (props) {
  const mysteryRef = useRef(null)
  const detectionRef = useRef(null)
  const resultRef = useRef(null)
  const barRef = useRef(null)
  const compositeRef = useRef(null)
  const linkRef = useRef(null)
  const videoLinkRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [scanning, setScanning] = props.scanning
  const [clear, setClear] = props.clear
  const [saveResult, setSaveResult] = props.saveResult
  let counter = 0
  let warped

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function startRecording() {
    // alert('record this')
  }

  function clearResult() {
    const resultCtx = resultRef.current.getContext('2d')
    resultCtx.clearRect(0, 0, resultCtx.canvas.width, resultCtx.canvas.height)
    // prep scanline
    detectionRef.current.style.display = 'inline-block'
    setClear(false)
  }

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
        const resultCanv = resultRef.current
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

  async function scanLine() {
    const videoRef = mysteryRef.current
    const ctx = detectionRef.current.getContext('2d')
    const chunkSize = 2 ** props.scanSize
    const direction = props.direction
    const numChannels = props.color ? 3 : 1

    // Slow scan on fast computers
    await sleep(props.scanBreaks * 10)

    const cut = tf.tidy(() => {
      const myTensor = tf.browser.fromPixels(videoRef, numChannels)
      let resizedTensor = tf.image
        .resizeBilinear(
          myTensor,
          [ctx.canvas.clientHeight, ctx.canvas.clientWidth],
          true
        )
        .div(255)
      if (props.mirror) resizedTensor = resizedTensor.reverse(1)
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
    ctx.shadowColor = 'red'
    ctx.shadowBlur = 5
    ctx.strokeStyle = '#0F0C'
    ctx.lineWidth = chunkSize
    ctx.beginPath()
    const resultCtx = resultRef.current.getContext('2d')
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
    const compositeCtx = compositeRef.current.getContext('2d')
    compositeCtx.drawImage(
      videoRef,
      0,
      0,
      ctx.canvas.clientWidth,
      ctx.canvas.clientHeight
    )
    compositeCtx.drawImage(resultRef.current, 0, 0)
    compositeCtx.drawImage(detectionRef.current, 0, 0)
    if (counter < endCount) {
      requestAnimationFrame(() => {
        scanLine()
      })
    } else if (props.loops) {
      counter = 0
      warped.dispose()
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      requestAnimationFrame(() => {
        scanLine()
      })
    } else {
      // stop recording
      // setTimeout(function () {
      //   mediaRecorder.stop()
      // }, 2000)

      // cleanup
      warped.dispose()
      detectionRef.current.style.display = 'none'
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      setScanning('scanned')
      console.log('DONE', tf.memory().numTensors)
    }
  }

  function savePNGResult() {
    const link = videoLinkRef.current
    link.setAttribute('download', 'TimeWarpScanMe.png')
    link.setAttribute(
      'href',
      resultRef.current
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
    )
    link.click()
    setSaveResult(false)
  }

  async function startScan() {
    await sleep(props.delayStart * 1000)
    if (props.record) startRecording()
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
    if (saveResult === 'PNG') savePNGResult()
    if (saveResult === 'MP4') alert('SAVE MP4')
  }, [saveResult])

  return (
    <div className="camContainer">
      <video
        ref={mysteryRef}
        id="mystery"
        width="100%"
        autoPlay
        style={{ transform: `scaleX(${props.mirror ? '-1' : '1'}` }}
      ></video>
      <canvas ref={resultRef} id="result"></canvas>
      <canvas ref={detectionRef} id="detection"></canvas>
      <div>
        <canvas
          ref={compositeRef}
          id="composite"
          style={{ display: 'none' }}
        ></canvas>
        <canvas ref={barRef} id="bar" style={{ display: 'none' }}></canvas>
        <a ref={linkRef} id="link"></a>
        <a ref={videoLinkRef} id="videoLink"></a>
      </div>
    </div>
  )
}
