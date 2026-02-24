import { DocumentTextIcon } from '@sanity/icons'
import { BASIC_BLOCK } from '../../constants'

const DATENSCHUTZ_FIELDS = [
    {
        name: 'title',
        title: 'Page Title',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'string', initialValue: 'Privacy Policy' },
            { name: 'de', title: 'German', type: 'string', initialValue: 'Datenschutz' },
        ],
        description: 'The main headline on the top of the page'
    },
    {
        name: 'subtitle',
        title: 'Subtitle',
        type: 'object',
        fields: [
            {
                name: 'en',
                title: 'English',
                type: 'array',
                of: [BASIC_BLOCK],
                description: 'Optional subtitle below the main title'
            },
            {
                name: 'de',
                title: 'German',
                type: 'array',
                of: [BASIC_BLOCK],
                description: 'Optional subtitle below the main title'
            },
        ],
    },
    {
        name: 'bodyText',
        title: 'Body Text',
        type: 'object',
        fields: [
            {
                name: 'en',
                title: 'English',
                type: 'array',
                of: [BASIC_BLOCK],
                description: 'Main content of the privacy policy page'
            },
            {
                name: 'de',
                title: 'German',
                type: 'array',
                of: [BASIC_BLOCK],
                description: 'Main content of the privacy policy page'
            },
        ],
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
            source: doc => doc?.title?.en || doc?.title?.de || 'datenschutz',
            maxLength: 200,
            slugify: input => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200)
        },
        initialValue: { current: 'datenschutz' },
        validation: Rule => Rule.required()
    }
]

export default {
    name: "datenschutz",
    title: "Datenschutz",
    type: "document",
    icon: DocumentTextIcon,
    fields: DATENSCHUTZ_FIELDS,
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de'
        },
        prepare({ titleEn, titleDe }) {
            return {
                title: titleEn || titleDe || 'Datenschutz'
            }
        }
    }
}

