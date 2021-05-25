// https://material-ui.com/components/switches/
// https://material-ui.com/components/slider/
import { useState } from "react"
import Scancam from "./Scancam"
import PanelButton from "./PanelButton"
import {
  FormControlLabel,
  FormGroup,
  Switch,
  Slider,
  Typography,
  Tooltip,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

const StylishSlider = withStyles({
  root: {
    color: "#f50057",
    height: 8,
  },
})(Slider)

const StyleishSelect = withStyles({
  root: {
    color: "white",
  },
  select: {
    borderBottom: "1px solid #f50057",
  },
  icon: {
    fill: "white",
  },
})(Select)

const StylishInputLabel = withStyles({
  root: {
    color: "#2e385d",
  },
})(InputLabel)

export default function Warper(props) {
  const [record, setRecord] = useState(true)
  const [mirror, setMirror] = useState(true)
  const [color, setColor] = useState(true)
  const [loops, setLoops] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [saveResult, setSaveResult] = useState(false)
  const [clear, setClear] = useState(false)
  const [delayStart, setDelayStart] = useState(0)
  const [scanBreaks, setScanBreaks] = useState(0)
  const [scanSize, setScanSize] = useState(2)
  const [direction, setDirection] = useState(0)

  return (
    <div className="full">
      <div className="podium">
        <Scancam
          record={record}
          mirror={mirror}
          color={color}
          loops={loops}
          scanning={[scanning, setScanning]}
          clear={[clear, setClear]}
          saveResult={[saveResult, setSaveResult]}
          delayStart={delayStart}
          scanBreaks={scanBreaks}
          scanSize={scanSize}
          direction={direction}
        />
        <div id="sidePanel">
          <PanelButton
            image="cleanscan"
            disabled={scanning === true}
            tooltip="Click to activate Time Warp Scan"
            rotate={direction === 1}
            click={() => setScanning(true)}
          />
          <p className="sLabel">SCAN</p>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={record}
                  disabled={scanning === true}
                  onChange={(e) => setRecord(e.target.checked)}
                />
              }
              label="Record"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mirror}
                  onChange={(e) => setMirror(e.target.checked)}
                />
              }
              label="Mirror"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={scanning === true}
                  checked={color}
                  onChange={(e) => setColor(e.target.checked)}
                />
              }
              label="Color"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={loops}
                  onChange={(e) => setLoops(e.target.checked)}
                />
              }
              label="Loop"
            />
          </FormGroup>
          <Divider style={{ margin: 15 }} />

          <Tooltip title="Number of seconds before a scan activates">
            <Typography id="discrete-slider" gutterBottom>
              Delay Start
            </Typography>
          </Tooltip>
          <StylishSlider
            defaultValue={0}
            value={delayStart}
            disabled={scanning === true}
            onChange={(e, v) => setDelayStart(v)}
            aria-labelledby="discrete-delay-slider"
            valueLabelDisplay="auto"
            marks
            style={{ width: "90%" }}
            min={0}
            max={10}
          />
          <Tooltip title="Slows scan speed">
            <Typography id="discrete-slider" gutterBottom>
              Scan Brakes
            </Typography>
          </Tooltip>
          <StylishSlider
            defaultValue={0}
            value={scanBreaks}
            onChange={(e, v) => setScanBreaks(v)}
            aria-labelledby="discrete-slow-slider"
            valueLabelDisplay="auto"
            marks
            style={{ width: "90%" }}
            min={0}
            max={50}
          />
          <Tooltip title="Adjust how many pixels get locked at a time by adjusting the scan line size">
            <Typography id="discrete-slider" gutterBottom>
              Scan Line Size
            </Typography>
          </Tooltip>
          <StylishSlider
            defaultValue={scanSize}
            aria-labelledby="discrete-chunk-slider"
            valueLabelDisplay="auto"
            marks
            value={scanSize}
            onChange={(e, v) => setScanSize(v)}
            scale={(x) => 2 ** x}
            style={{ width: "90%" }}
            min={0}
            max={6}
          />
          <FormControl style={{ width: "90%", marginTop: 5, marginBottom: 20 }}>
            <StylishInputLabel id="direction-simple-select-label">
              Direction
            </StylishInputLabel>
            <StyleishSelect
              labelId="direction-simple-select-label"
              id="direction-simple-select"
              disabled={scanning === true}
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <MenuItem value={0}>Top-Down</MenuItem>
              <MenuItem value={1}>Left-Right</MenuItem>
            </StyleishSelect>
          </FormControl>
          <div className="buttonRow">
            <PanelButton
              mini
              image="watch"
              tooltip="Watch recording of the scan"
              disabled={scanning !== "scanned" || record === false}
              click={() => (window.location.href = "#playbackVideo")}
            />
            <PanelButton
              mini
              image="clear2"
              tooltip="Clear scan results"
              disabled={scanning === true}
              click={() => setClear(true)}
            />
          </div>
          <div className="buttonRow">
            <PanelButton
              mini
              image="mp4"
              tooltip="Download MP4 of the scan"
              disabled={scanning !== "scanned" || record === false}
              click={() => setSaveResult("MP4")}
            />
            <PanelButton
              mini
              image="png"
              tooltip="Download PNG of the scan"
              disabled={scanning !== "scanned"}
              click={() => setSaveResult("PNG")}
            />
          </div>
        </div>
      </div>
      <div className="footer">
        <div>
          <a onClick={props.resetSeen}>About</a>
        </div>
        <div>
          <a href="https://github.com/GantMan/timewarp/tree/main/timewarpscanme">
            <img src="./GitHub-Mark-Light-64px.png" />
            <br />
            Source Code
          </a>
        </div>
        <span>
          Get the book:{" "}
          <a href="https://amzn.to/3dR3vpY">Learn TensorFlow.js</a>
        </span>
        <div>
          <a href="https://infinite.red">
            <img src="https://assets.website-files.com/5e67db0c1e7a468249544a75/5e6ad55212785322a62948a6_logo-ir%402x.png" />
          </a>
        </div>
      </div>
    </div>
  )
}
