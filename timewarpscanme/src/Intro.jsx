export default function Intro(props) {
  return (
    <>
      <div className="podium intro">
        <h1 className="hero">
          <img
            className="open"
            src="/open.webp"
            width="1000"
            height="841"
            fetchpriority="high"
            alt="Time Warp Scan"
          />
        </h1>
        <div className="about">
          <h2 className="mega">warp</h2>
          <p>
            Try the popular “Time Warp Scan” directly in your browser and
            instantly share the results with your friends.
          </p>
          <h2 className="mega">safely</h2>
          <p>
            This website runs 100% on your machine and does not retain any copy
            of your images or videos. This site is free and open source by Gant
            Laborde of Infinite Red.
          </p>

          <button className="boxbutton" onClick={props.exploreClick}>
            EXPLORE
          </button>
        </div>
      </div>

      <main className="info">
        <section>
          <h2>Do the Time Warp Scan online, no app needed</h2>
          <p>
            The Time Warp Scan is the viral video filter where a line sweeps
            across the screen and freezes everything it touches. Move while the
            line passes and you can stretch your face, duplicate yourself, or
            pull off impossible illusions. TimeWarpScan.me brings that effect
            to your browser, with no TikTok, no download and no sign-up.
          </p>
        </section>

        <section>
          <h2>How to use it</h2>
          <ol>
            <li>
              Click <strong>Explore</strong> and allow access to your camera.
            </li>
            <li>
              Pick a direction (top-down or left-right) and adjust the scan
              speed, scan line size and delayed start if you like.
            </li>
            <li>
              Press <strong>Scan</strong> and move as the line passes over you.
            </li>
            <li>
              Watch the replay, then download your time warp as a{" "}
              <strong>PNG image</strong> or a <strong>video</strong>.
            </li>
          </ol>
        </section>

        <section>
          <h2>Frequently asked questions</h2>
          <h3>Are my photos or videos uploaded anywhere?</h3>
          <p>
            No. All processing happens on your device with TensorFlow.js and
            WebGL. Nothing is uploaded or stored on a server.
          </p>
          <h3>Which browsers work?</h3>
          <p>
            Recent versions of Chrome, Edge and Safari on desktop work best.
            You need a webcam and must allow camera access.
          </p>
          <h3>How does it work?</h3>
          <p>
            Each frame from your webcam becomes a tensor. A thin slice is cut
            from the current frame and stitched onto the slices that came
            before it, so every row (or column) of the final image was captured
            at a slightly different moment in time. The{" "}
            <a href="https://github.com/GantMan/timewarp">source code</a> is on
            GitHub, and the techniques are covered in the book{" "}
            <a href="https://amzn.to/3dR3vpY">Learning TensorFlow.js</a>.
          </p>
        </section>

        <footer className="credits">
          Made by <a href="https://gantlaborde.com">Gant Laborde</a> of{" "}
          <a href="https://infinite.red">Infinite Red</a> ·{" "}
          <a href="https://github.com/GantMan/timewarp">Open source on GitHub</a>
        </footer>
      </main>
    </>
  )
}
