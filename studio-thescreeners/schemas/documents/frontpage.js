import { HomeIcon } from '@sanity/icons'
import { ADVANCED_SEO_FIELDS } from '../../constants'

const EXTRA_FIELDS = [
    {
        name: 'heroMediaType',
        title: 'Hero Media Type',
        type: 'string',
        options: {
            list: [
                { title: 'Single Image', value: 'image' },
                { title: 'Image Slider', value: 'slider' },
                { title: 'Video', value: 'video' }
            ],
            layout: 'radio'
        },
        initialValue: 'image',
        validation: Rule => Rule.required()
    },
    {
        name: 'heroImage',
        title: 'Hero Image',
        type: 'image',
        description: 'Hero Image: Cinematic format (wide aspect ratio)',
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
        hidden: ({ parent }) => parent?.heroMediaType !== 'image'
    },
    {
        name: 'heroSlider',
        title: 'Hero Image Slider',
        type: 'array',
        of: [
            {
                type: 'image',
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
                ]
            }
        ],
        description: 'Multiple images for hero slider. Cinematic format (wide aspect ratio) for each image.',
        hidden: ({ parent }) => parent?.heroMediaType !== 'slider'
    },
    {
        name: 'heroVideo',
        title: 'Hero Video',
        type: 'file',
        options: {
            accept: 'video/*'
        },
        description: 'Hero Video: Cinematic format (wide aspect ratio). Recommended dimensions: 2560x1080 or similar wide format. Maximum file size: 50MB. Supported formats: MP4, WebM, MOV.',
        fields: [
            {
                name: 'alt',
                title: 'Alt Text',
                type: 'object',
                fields: [
                    { name: "en", title: "English", type: "string" },
                    { name: "de", title: "German", type: "string" },
                ],
            },
            {
                name: 'poster',
                title: 'Video Poster Image',
                type: 'image',
                description: 'Thumbnail image shown before video plays. Cinematic format (wide aspect ratio).',
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
                ]
            },
            {
                name: 'autoplay',
                title: 'Autoplay',
                type: 'boolean',
                initialValue: true,
                description: 'Automatically play video when page loads'
            },
            {
                name: 'loop',
                title: 'Loop',
                type: 'boolean',
                initialValue: true,
                description: 'Loop video continuously'
            },
            {
                name: 'muted',
                title: 'Muted',
                type: 'boolean',
                initialValue: true,
                description: 'Play video without sound (required for autoplay in most browsers)'
            }
        ],
        hidden: ({ parent }) => parent?.heroMediaType !== 'video'
    },
]

const FIELDS = EXTRA_FIELDS.concat(ADVANCED_SEO_FIELDS) 

export default {
    name: "frontpage",
    title: "Frontpage",
    type: "document",
    icon: HomeIcon,
    fields: FIELDS,
    
    preview: {
        select: {},
        prepare() {
            return {
                title: 'THE SCREENERS'
            }
        }
    }
}
