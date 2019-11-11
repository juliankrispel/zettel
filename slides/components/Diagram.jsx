import React from 'react'
import { useSteps } from 'mdx-deck'

export default props => {
  const step = useSteps(4)

  return (
    <div>
      The current step is {step}
    </div>
  )
}