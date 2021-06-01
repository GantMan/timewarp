import React from "react"
import { Select, InputLabel, MenuItem, FormControl } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

const StylishInputLabel = withStyles({
  root: {
    color: "#2e385d",
  },
})(InputLabel)

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

class DeviceDrop extends React.Component {
  render() {
    const devices = this.props.devices
    const optionItems =
      devices &&
      devices.map((device) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label}
        </option>
      ))

    return (
      <FormControl
        style={{ width: "90%", marginTop: 5, marginBottom: 20, maxWidth: 115 }}
      >
        <StylishInputLabel id="device-simple-select-label">
          Video Device
        </StylishInputLabel>
        <StyleishSelect
          labelId="device-simple-select-label"
          id="device-simple-select"
          disabled={this.props.scanning === true}
          onChange={(event) => this.props.onChange(event.target.value)}
          value={this.props.select}
        >
          <MenuItem disabled={!!this.props.select} value={"None"}>
            Choose a Camera
          </MenuItem>
          {optionItems}
        </StyleishSelect>
      </FormControl>
    )
  }
}

export default DeviceDrop
