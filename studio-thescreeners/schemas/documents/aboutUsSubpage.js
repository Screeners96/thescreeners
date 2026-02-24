import { DocumentTextIcon } from '@sanity/icons'
import { BASIC_BLOCK } from '../../constants'

const EXTRA_FIELDS = [
    {
        name: 'sectionType',
        title: 'Section Type',
        type: 'string',
        options: {
            list: [
                { title: 'Grid Wrapper Section', value: 'gridWrapper' },
                { title: 'Logos Section', value: 'logos' },
                { title: 'Grid Images Section', value: 'gridImages' }
            ],
            layout: 'dropdown'
        },
        validation: Rule => Rule.required(),
        initialValue: 'gridWrapper'
    }
]

const FIELDS = EXTRA_FIELDS.concat([
    {
        name: 'title',
        title: 'Title',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'string' },
            { name: 'de', title: 'German', type: 'string' },
        ],
        description: 'The main headline for the section'
    },
    {
        name: 'grids',
        title: 'Grid Wrappers',
        type: 'array',
        of: [
            { type: "wrapperGrid1Top2bottom" },
            { type: "wrapperGrid2Top1Bottom" },
            { type: "wrapperGridVertical" },
            { type: "wrapperGrid3Vertical" }
        ],
        description: 'Add grid wrapper layouts',
        hidden: ({ parent }) => parent?.sectionType !== 'gridWrapper'
    },
    {
        name: 'bodyText',
        title: 'Body Text',
        type: "object",
        fields: [
            {
                name: 'en',
                title: 'English',
                type: 'array',
                of: [BASIC_BLOCK]
            },
            {
                name: 'de',
                title: 'German',
                type: 'array',
                of: [BASIC_BLOCK]
            },
        ],
        hidden: ({ parent }) => parent?.sectionType !== 'logos' && parent?.sectionType !== 'gridImages'
    },
    {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
            {
                type: 'image',
                options: {
                    hotspot: true,
                    metadata: ['blurhash', 'lqip', 'palette']
                },
                fields: [
                    {
                        name: 'alt',
                        title: 'Alt Text',
                        type: 'object',
                        fields: [
                            { name: "en", title: "English", type: "string" },
                            { name: "de", title: "German", type: "string" },
                        ],
                    }
                ],
                preview: {
                    select: {
                        imageUrl: 'asset.url',
                        altEn: 'alt.en',
                        altDe: 'alt.de',
                        originalFilename: 'asset.originalFilename'
                    },
                    prepare({ imageUrl, altEn, altDe, originalFilename }) {
                        return {
                            title: originalFilename || 'Image',
                            subtitle: altEn || altDe || 'No alt text',
                            imageUrl: imageUrl
                        }
                    }
                }
            }
        ],
        options: {
            layout: 'list'
        },
        description: 'Upload multiple images - drag and drop to reorder',
        hidden: ({ parent }) => parent?.sectionType !== 'logos' && parent?.sectionType !== 'gridImages'
    },
    {
        name: 'description',
        title: 'SEO Description',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'de', title: 'German', type: 'text' },
        ],
    },
    {
        title: 'Slug',
        name: 'slug',
        type: 'slug',
        description: 'Click "Generate" to auto-create from title, or edit manually',
        options: {
            source: doc => doc?.title?.en || doc?.title?.de || '',
            maxLength: 200,
            slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200)
        },
        validation: Rule => Rule.required()
    }
])

export default {
    name: "aboutUsSubpage",
    title: "About Us Section",
    type: "document",
    icon: DocumentTextIcon,
    fields: FIELDS,
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de',
            sectionType: 'sectionType'
        },
        prepare({ titleEn, titleDe, sectionType }) {
            const title = titleEn || titleDe || 'Untitled'
            const typeLabels = {
                'gridWrapper': 'Grid Wrapper',
                'logos': 'Logos',
                'gridImages': 'Grid Images'
            }
            const typeLabel = sectionType ? ` (${typeLabels[sectionType] || sectionType})` : ''
            return {
                title: `${title}${typeLabel}`
            }
        }
    }
}

