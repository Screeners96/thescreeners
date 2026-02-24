import { UserIcon } from '@sanity/icons'
import { BASIC_BLOCK } from '../../constants'

const ABOUT_US_MODULES = [
    { type: "wrapperTextBig" },
    { type: "wrapperSubtitle" },
    { type: "wrapperTitle" },
    { type: "wrapperImage" },
    { type: "wrapperVideo" }
]

const ABOUT_US_GRIDS = [
    { type: "wrapperGrid1Top2bottom" },
    { type: "wrapperGrid2Top1Bottom" },
    { type: "wrapperGridVertical" },
    { type: "wrapperGrid3Vertical" }
]

export default {
    name: "aboutUs",
    title: "About Us",
    type: "document",
    icon: UserIcon,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
            ],
            description: 'The main headline on the top of the page'
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
            description: 'Intro text displayed at the top of the page'
        },
        {
            name: 'grids',
            title: 'Grid Wrappers',
            type: 'array',
            of: ABOUT_US_GRIDS,
            description: 'Add grid wrapper layouts to the About Us page'
        },
        {
            name: 'sectionsOrder',
            title: 'About Us Sections Order',
            type: 'array',
            description: 'Drag and drop to reorder the About Us sections. Only sections added here will be displayed.',
            of: [{
                type: 'reference', 
                to: [{type: 'aboutUsSubpage'}]
            }]
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
    ],
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de'
        },
        prepare({ titleEn, titleDe }) {
            return {
                title: titleEn || titleDe || 'Untitled'
            }
        }
    }
}

