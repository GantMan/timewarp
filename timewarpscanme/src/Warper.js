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
      <a onClick={props.resetSeen}>RESET</a>
    </div>
  )
}
