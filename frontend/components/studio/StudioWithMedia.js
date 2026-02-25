'use client'

import { useEffect, useState } from 'react'
import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../../../studio-thescreeners/schemas'
import deskStructure from '../../../studio-thescreeners/deskStructure'
import { colorInput } from '@sanity/color-input'

const baseConfig = defineConfig({
  name: 'default',
  title: 'THESCREENERS',
  projectId: '21f3spns',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
    colorInput(),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => templateItem.templateId != 'frontpage')
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === 'frontpage') {
        return prev.filter(({ action }) => !['unpublish', 'delete', 'duplicate'].includes(action))
      }
      return prev
    },
  },
})

export default function StudioWithMedia() {
  const [config, setConfig] = useState(baseConfig)

  useEffect(() => {
    import('sanity-plugin-media')
      .then(({ media }) => {
        setConfig((prev) => ({
          ...prev,
          plugins: [...prev.plugins, media()],
        }))
      })
      .catch((err) => console.error('Failed to load media plugin:', err))
  }, [])

  return <NextStudio config={config} />
}
