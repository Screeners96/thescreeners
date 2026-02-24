import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import deskStructure from './deskStructure'
import { colorInput } from "@sanity/color-input"
import { media } from 'sanity-plugin-media'
import { languages } from './schemas/languages'

export default defineConfig({
    name: 'default',
    title: 'THESCREENERS',

    projectId: '21f3spns',
    dataset: 'production',
    basePath: '/studio',

    plugins: [
        deskTool({
            structure: deskStructure
        }), 
        visionTool(),
        colorInput(),
        media()
    ],

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
