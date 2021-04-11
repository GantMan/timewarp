// https://material-ui.com/components/switches/
import Scancam from './Scancam'
import { FormControlLabel, FormGroup, Switch } from '@material-ui/core';

export default function Warper(props) {
  return (
    <div className="full">
      <div className="podium">
        <Scancam />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={true}  />}
            label="Spank Me"
          />
        </FormGroup>
      </div>
      <a onClick={props.resetSeen}>RESET</a>
    </div>
  )
}
