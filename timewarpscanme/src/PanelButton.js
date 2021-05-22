import React from 'react'
import { Tooltip } from '@material-ui/core'

export default function (props) {
  const looks = ['sideButton']
  if (props.disabled) looks.push('dim')
  if (props.rotate) looks.push('rotateButton')
  if (props.mini) looks.push('miniButton')
  return (
    <Tooltip title={props.tooltip}>
      <img
        src={`/${props.image}.png`}
        className={looks.join(' ')}
        onClick={() => {
          if (!props.disabled) props.click()
        }}
      />
    </Tooltip>
  )
}
