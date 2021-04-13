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
