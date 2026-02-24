import { EnvelopeIcon } from '@sanity/icons'
import { BASIC_BLOCK } from '../../constants'

const CONTACT_FIELDS = [
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
        name: 'googleMaps',
        title: 'Google Maps',
        type: 'object',
        fields: [
            {
                name: 'apiKey',
                title: 'Google Maps API Key',
                type: 'string',
                description: 'Your Google Maps API key for embedding maps',
                // validation: Rule => Rule.required()
            },
            {
                name: 'latitude',
                title: 'Latitude',
                type: 'number',
                description: 'Location latitude coordinate',
                validation: Rule => Rule.required().min(-90).max(90)
            },
            {
                name: 'longitude',
                title: 'Longitude',
                type: 'number',
                description: 'Location longitude coordinate',
                validation: Rule => Rule.required().min(-180).max(180)
            }
        ],
        validation: Rule => Rule.required()
    },
    {
        name: 'infoItems',
        title: 'Info Items',
        type: 'array',
        of: [
            {
                type: 'object',
                name: 'infoAddress',
                title: 'Address',
                fields: [
                    {
                        name: 'title',
                        title: 'Title',
                        type: 'object',
                        fields: [
                            { name: 'en', title: 'English', type: 'string' },
                            { name: 'de', title: 'German', type: 'string' },
                        ],
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'bodyText',
                        title: 'Address Text',
                        type: 'object',
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
                            title: 'Address',
                            subtitle: titleEn || titleDe || 'Untitled'
                        }
                    }
                }
            },
            {
                type: 'object',
                name: 'infoTitle',
                title: 'Title Only',
                fields: [
                    {
                        name: 'title',
                        title: 'Title',
                        type: 'object',
                        fields: [
                            { name: 'en', title: 'English', type: 'string' },
                            { name: 'de', title: 'German', type: 'string' },
                        ],
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
                            title: 'Title Only',
                            subtitle: titleEn || titleDe || 'Untitled'
                        }
                    }
                }
            },
            {
                type: 'object',
                name: 'infoLink',
                title: 'External Link',
                fields: [
                    {
                        name: 'title',
                        title: 'Title/Label',
                        type: 'object',
                        fields: [
                            { name: 'en', title: 'English', type: 'string' },
                            { name: 'de', title: 'German', type: 'string' },
                        ],
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'url',
                        title: 'URL',
                        type: 'url',
                        validation: Rule => Rule.required()
                    }
                ],
                preview: {
                    select: {
                        titleEn: 'title.en',
                        titleDe: 'title.de',
                        url: 'url'
                    },
                    prepare({ titleEn, titleDe, url }) {
                        const title = titleEn || titleDe || 'Untitled'
                        return {
                            title: 'External Link',
                            subtitle: `${title} - ${url || 'No URL'}`
                        }
                    }
                }
            },
            {
                type: 'object',
                name: 'infoEmail',
                title: 'Email',
                fields: [
                    {
                        name: 'title',
                        title: 'Title/Label',
                        type: 'object',
                        fields: [
                            { name: 'en', title: 'English', type: 'string' },
                            { name: 'de', title: 'German', type: 'string' },
                        ],
                        description: 'Label/indicator for the email (e.g., "Email", "Contact")'
                    },
                    {
                        name: 'email',
                        title: 'Email Address',
                        type: 'string',
                        validation: Rule => Rule.required().regex(
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            {
                                name: 'email',
                                invert: false
                            }
                        ).error('Please enter a valid email address')
                    }
                ],
                preview: {
                    select: {
                        titleEn: 'title.en',
                        titleDe: 'title.de',
                        email: 'email'
                    },
                    prepare({ titleEn, titleDe, email }) {
                        const title = titleEn || titleDe || 'Email'
                        return {
                            title: 'Email',
                            subtitle: `${title}: ${email || 'No email'}`
                        }
                    }
                }
            },
            {
                type: 'object',
                name: 'infoPhone',
                title: 'Phone',
                fields: [
                    {
                        name: 'title',
                        title: 'Title/Label',
                        type: 'object',
                        fields: [
                            { name: 'en', title: 'English', type: 'string' },
                            { name: 'de', title: 'German', type: 'string' },
                        ],
                        description: 'Label/indicator for the phone (e.g., "Phone", "Tel")'
                    },
                    {
                        name: 'phone',
                        title: 'Phone Number',
                        type: 'string',
                        validation: Rule => Rule.required()
                    }
                ],
                preview: {
                    select: {
                        titleEn: 'title.en',
                        titleDe: 'title.de',
                        phone: 'phone'
                    },
                    prepare({ titleEn, titleDe, phone }) {
                        const title = titleEn || titleDe || 'Phone'
                        return {
                            title: 'Phone',
                            subtitle: `${title}: ${phone || 'No phone'}`
                        }
                    }
                }
            }
        ],
        description: 'Add contact information items (address, title, links, email, phone)'
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
]

const FIELDS = CONTACT_FIELDS

export default {
    name: "contact",
    title: "Contact",
    type: "document",
    icon: EnvelopeIcon,
    fields: FIELDS,
    
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

