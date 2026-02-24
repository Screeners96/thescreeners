import React from 'react'
import { LaunchIcon } from '@sanity/icons'

const ExternalLinkRenderer = props => (
  <button>
        {props.renderDefault(props)}
        <a contentEditable={false} href={props.value.href}></a>
  </button>
)

export default ExternalLinkRenderer