import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../studio-thescreeners/schemas'
import deskStructure from '../studio-thescreeners/deskStructure'
import { colorInput } from '@sanity/color-input'

// Media plugin loaded dynamically on client to avoid date-fns ESM/SSR issue (see sanity-plugin-media#245)
const getBasePlugins = () => [
  structureTool({
    structure: deskStructure,
  }),
  visionTool(),
  colorInput(),
]

export default defineConfig({
  name: 'default',
  title: 'THESCREENERS',

  projectId: '21f3spns',
  dataset: 'production',
  basePath: '/studio',

  plugins: getBasePlugins(),

  schema: {
    types: schemaTypes,
  },

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
