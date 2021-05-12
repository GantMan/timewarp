import React from 'react'

export default function (props) {
  const looks = ['sideButton']
  if (props.disabled) looks.push('dim')
  return (
    <img
      src={`/${props.image}.png`}
      className={looks.join(' ')}
      onClick={() => {
        if (!props.disabled) props.click()
      }}
    />
  )
}
