import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from '../../../studio-thescreeners/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}

export { metadata }
