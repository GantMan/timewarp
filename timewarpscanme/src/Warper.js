// https://material-ui.com/components/switches/
import { useState } from 'react'
import Scancam from './Scancam'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'

export default function Warper(props) {
  const [record, setRecord] = useState(false)
  const [mirror, setMirror] = useState(false)
  const [color, setColor] = useState(true)

  return (
    <div className="full">
      <div className="podium">
        <Scancam record={record} mirror={mirror} color={color} />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={record} onChange={(e) => setRecord(e.target.checked)} />}
            label="Record"
          />
          <FormControlLabel
            control={<Switch checked={mirror} onChange={(e) => setMirror(e.target.checked)} />}
            label="Mirror"
          />
          <FormControlLabel
            control={<Switch checked={color} onChange={(e) => setColor(e.target.checked)} />}
            label="Color"
          />
        </FormGroup>
      </div>
      <div className="footer">
        <div>
          <a onClick={props.resetSeen}>RESET</a>
        </div>
        <div>
          <a href="https://github.com/GantMan/timewarp/tree/main/timewarpscanme">
            <img src="./GitHub-Mark-Light-64px.png" />
            <br />
            Source Code
          </a>
        </div>
        <span>Get the book: <a href="https://amzn.to/3dR3vpY">Learn TensorFlow.js</a></span>
        <div>
          <a href="https://infinite.red">
            <img src="https://assets.website-files.com/5e67db0c1e7a468249544a75/5e6ad55212785322a62948a6_logo-ir%402x.png" />
          </a>
        </div>
      </div>
    </div>
  )
}
