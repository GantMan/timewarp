// https://material-ui.com/components/switches/
import { useState } from 'react'
import Scancam from './Scancam'
import PanelButton from './PanelButton'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'

export default function Warper(props) {
  const [record, setRecord] = useState(true)
  const [mirror, setMirror] = useState(false)
  const [color, setColor] = useState(true)
  const [scanning, setScanning] = useState(true)

  return (
    <div className="full">
      <div className="podium">
        <Scancam
          record={record}
          mirror={mirror}
          color={color}
          scanning={[scanning, setScanning]}
        />
        <div id="sidePanel">
          <PanelButton
            image="scan"
            disabled={scanning}
            click={() => setScanning(true)}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={record}
                  disabled={scanning}
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
                  checked={color}
                  onChange={(e) => setColor(e.target.checked)}
                />
              }
              label="Color"
            />
          </FormGroup>

          <PanelButton
            image="watch"
            disabled={true}
            click={() => alert(scanning)}
          />
          <PanelButton
            image="mp4"
            disabled={true}
            click={() => alert(scanning)}
          />
          <PanelButton
            image="png"
            disabled={true}
            click={() => alert(scanning)}
          />
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
          Get the book:{' '}
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
