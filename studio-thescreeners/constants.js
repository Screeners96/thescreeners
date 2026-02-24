import ExternalLinkRenderer from "./externalLinkRenderer"
import { TransferIcon, EnvelopeIcon } from '@sanity/icons'

export const PAGE_REFERENCES = [
    {type: 'frontpage'},
    {type: 'page'},
    {type: 'trailer'},
    {type: 'trailerSubpage'},
    {type: 'event'},
    {type: 'eventSubpage'},
    {type: 'imagefilm'},
    {type: 'imagefilmSubpage'},
    {type: 'aboutUs'},
    {type: 'aboutUsSubpage'},
    {type: 'contact'},
]

export const MODULES = [
    {type: "moduleImage"},
    {type: "moduleSlider"},
    {type: "moduleSpace"},
    {type: "moduleText"},
    {type: "moduleVideo"},
]

export const GRID = [
    {type: "GridVertical"},
    {type: "Grid3Bottom"},
    {type: "Grid3Top"},
    {type: "Grid3Vertical"},
    {type: "GridFull"},
]

export const GROUPS = [
    {   
      name: 'content',
      title: 'Content',
      default: true
    },
    {   
        name: 'meta',
        title: 'Meta'
    }
]

export const BASIC_BLOCK = {
    type: 'block',
    styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'}
    ],
    lists: [],
    marks: {
        decorators: [
            {title: 'Emphasis', value: 'em'},
            {title: 'Strong', value: 'strong'},
        ],
        annotations: [
            {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                    {
                        name: 'url',
                        type: 'url'
                    }
                ],
            },
            {
                name: 'emailLink',
                type: 'object',
                title: 'Email Link',
                icon: EnvelopeIcon,
                fields: [
                    {
                        name: 'email',
                        type: 'string',
                        title: 'Email Address',
                        validation: Rule => Rule.regex(
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            {
                                name: 'email',
                                invert: false
                            }
                        ).error('Please enter a valid email address')
                    },
                    {
                        name: 'subject',
                        type: 'string',
                        title: 'Subject (optional)'
                    }
                ],
            },
            {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Link',
                icon: TransferIcon,
                fields: [
                    {
                        name: 'reference',
                        type: 'reference',
                        title: 'Reference',
                        to: [
                            { type: 'page' },
                            { type: 'trailer' },
                            { type: 'trailerSubpage' },
                            { type: 'event' },
                            { type: 'eventSubpage' },
                            { type: 'imagefilm' },
                            { type: 'imagefilmSubpage' },
                            { type: 'aboutUs' },
                            { type: 'aboutUsSubpage' },
                            { type: 'contact' },
                        ]
                    }
                ]
            }
        ]
    }
};

// RTE_BLOCKS removed - using BASIC_BLOCK directly

export const PAGE_FIELDS_REGULAR = [
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
    },
    {
        title: "Grid",
        name: "grid",
        type: "array",
        of: GRID,
        description: 'Select projects to grid'
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

// Trailer-specific fields (without Grid - grid moved to categories)
export const PAGE_FIELDS_TRAILER = [
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

export const PROJECTS_MODULES = [
    {type: "projectModuleImage"},
    {type: "projectModuleVimeo"},
    {type: "projectModuleVideo"},
    {type: "projectModuleSlider"},
]

export const PAGE_FIELDS_MODULES = [
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
        name: 'teaserImage',
        title: 'Teaser Image',
        type: 'image',
    
        options: {
            hotspot: true
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
        ]
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
    },
    {
        title: "Project Modules",
        name: "projectModules",
        type: "array",
        of: PROJECTS_MODULES,
        description: 'Add media modules to this project (images, videos, sliders)'
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

export const ADVANCED_SEO_FIELDS = [
    {
        name: 'seoTitle',
        title: 'SEO Title',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'string' },
            { name: 'de', title: 'German', type: 'string' },
        ],
        description: 'Custom title for search engines (50-60 characters recommended). If empty, page title will be used.'
    },
    {
        name: 'seoDescription',
        title: 'SEO Meta Description',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'text' },
            { name: 'de', title: 'German', type: 'text' },
        ],
        description: 'Meta description for search engines (150-160 characters recommended)'
    },
    {
        name: 'seoKeywords',
        title: 'SEO Keywords',
        type: 'object',
        fields: [
            { name: 'en', title: 'English', type: 'string' },
            { name: 'de', title: 'German', type: 'string' },
        ],
        description: 'Comma-separated keywords for this page'
    },
    {
        name: 'canonicalUrl',
        title: 'Canonical URL',
        type: 'url',
        description: 'Canonical URL to prevent duplicate content issues. Leave empty to use default page URL.'
    },
    {
        name: 'robotsMeta',
        title: 'Robots Meta Tags',
        type: 'object',
        fields: [
            {
                name: 'noindex',
                title: 'No Index',
                type: 'boolean',
                initialValue: false,
                description: 'Prevent search engines from indexing this page'
            },
            {
                name: 'nofollow',
                title: 'No Follow',
                type: 'boolean',
                initialValue: false,
                description: 'Prevent search engines from following links on this page'
            },
            {
                name: 'noarchive',
                title: 'No Archive',
                type: 'boolean',
                initialValue: false,
                description: 'Prevent search engines from archiving this page'
            },
            {
                name: 'nosnippet',
                title: 'No Snippet',
                type: 'boolean',
                initialValue: false,
                description: 'Prevent search engines from showing snippets of this page'
            }
        ]
    },
    {
        name: 'openGraph',
        title: 'Open Graph (Social Media)',
        type: 'object',
        fields: [
            {
                name: 'ogTitle',
                title: 'OG Title',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'string' },
                    { name: 'de', title: 'German', type: 'string' },
                ],
                description: 'Title for social media sharing (overrides SEO title)'
            },
            {
                name: 'ogDescription',
                title: 'OG Description',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'text' },
                    { name: 'de', title: 'German', type: 'text' },
                ],
                description: 'Description for social media sharing (overrides SEO description)'
            },
            {
                name: 'ogImage',
                title: 'OG Image',
                type: 'image',
                description: 'Image for social media sharing (recommended: 1200x630px)',
                options: {
                    hotspot: true
                }
            },
            {
                name: 'ogType',
                title: 'OG Type',
                type: 'string',
                options: {
                    list: [
                        { title: 'Website', value: 'website' },
                        { title: 'Article', value: 'article' },
                        { title: 'Video', value: 'video' },
                        { title: 'Music', value: 'music' },
                        { title: 'Profile', value: 'profile' }
                    ]
                },
                initialValue: 'website'
            },
            {
                name: 'ogSiteName',
                title: 'OG Site Name',
                type: 'string',
                description: 'Name of your website'
            },
            {
                name: 'ogUrl',
                title: 'OG URL',
                type: 'url',
                description: 'Canonical URL for this page (overrides default)'
            }
        ]
    },
    {
        name: 'twitterCard',
        title: 'Twitter Card',
        type: 'object',
        fields: [
            {
                name: 'cardType',
                title: 'Card Type',
                type: 'string',
                options: {
                    list: [
                        { title: 'Summary', value: 'summary' },
                        { title: 'Summary Large Image', value: 'summary_large_image' },
                        { title: 'App', value: 'app' },
                        { title: 'Player', value: 'player' }
                    ]
                },
                initialValue: 'summary_large_image'
            },
            {
                name: 'twitterTitle',
                title: 'Twitter Title',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'string' },
                    { name: 'de', title: 'German', type: 'string' },
                ],
                description: 'Title for Twitter sharing (overrides OG title)'
            },
            {
                name: 'twitterDescription',
                title: 'Twitter Description',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'text' },
                    { name: 'de', title: 'German', type: 'text' },
                ],
                description: 'Description for Twitter sharing (overrides OG description)'
            },
            {
                name: 'twitterImage',
                title: 'Twitter Image',
                type: 'image',
                description: 'Image for Twitter sharing (recommended: 1200x675px for large image cards)',
                options: {
                    hotspot: true
                }
            },
            {
                name: 'twitterSite',
                title: 'Twitter Site',
                type: 'string',
                description: 'Twitter @username of the site (e.g., @yourhandle)'
            },
            {
                name: 'twitterCreator',
                title: 'Twitter Creator',
                type: 'string',
                description: 'Twitter @username of the content creator (e.g., @authorhandle)'
            }
        ]
    },
    {
        name: 'schemaOrg',
        title: 'Schema.org Structured Data',
        type: 'object',
        fields: [
            {
                name: 'enableSchema',
                title: 'Enable Schema.org Markup',
                type: 'boolean',
                initialValue: true,
                description: 'Enable structured data for better search engine understanding'
            },
            {
                name: 'schemaType',
                title: 'Schema Type',
                type: 'string',
                options: {
                    list: [
                        { title: 'WebPage', value: 'WebPage' },
                        { title: 'WebSite', value: 'WebSite' },
                        { title: 'Article', value: 'Article' },
                        { title: 'VideoObject', value: 'VideoObject' },
                        { title: 'ImageObject', value: 'ImageObject' },
                        { title: 'Organization', value: 'Organization' },
                        { title: 'Person', value: 'Person' },
                        { title: 'BreadcrumbList', value: 'BreadcrumbList' }
                    ]
                },
                initialValue: 'WebPage',
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaName',
                title: 'Schema Name',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'string' },
                    { name: 'de', title: 'German', type: 'string' },
                ],
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaDescription',
                title: 'Schema Description',
                type: 'object',
                fields: [
                    { name: 'en', title: 'English', type: 'text' },
                    { name: 'de', title: 'German', type: 'text' },
                ],
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaImage',
                title: 'Schema Image',
                type: 'image',
                description: 'Image for structured data',
                options: {
                    hotspot: true
                },
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaDatePublished',
                title: 'Date Published',
                type: 'datetime',
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaDateModified',
                title: 'Date Modified',
                type: 'datetime',
                hidden: ({ parent }) => !parent?.enableSchema
            },
            {
                name: 'schemaAuthor',
                title: 'Author',
                type: 'object',
                fields: [
                    {
                        name: 'name',
                        title: 'Author Name',
                        type: 'string'
                    },
                    {
                        name: 'url',
                        title: 'Author URL',
                        type: 'url'
                    }
                ],
                hidden: ({ parent }) => !parent?.enableSchema
            }
        ]
    },
    {
        name: 'additionalMetaTags',
        title: 'Additional Meta Tags',
        type: 'array',
        of: [
            {
                type: 'object',
                fields: [
                    {
                        name: 'name',
                        title: 'Meta Name/Property',
                        type: 'string',
                        validation: Rule => Rule.required()
                    },
                    {
                        name: 'content',
                        title: 'Content',
                        type: 'string',
                        validation: Rule => Rule.required()
                    }
                ],
                preview: {
                    select: {
                        name: 'name',
                        content: 'content'
                    },
                    prepare({ name, content }) {
                        return {
                            title: `${name}: ${content}`
                        }
                    }
                }
            }
        ],
        description: 'Add custom meta tags (name/content pairs)'
    }
]


