import {CogIcon} from '@sanity/icons'

export default {
    name: "settings",
    title: "Settings",
    type: "document",
    icon: CogIcon,
    fields: [
        {
            name: 'colorsAccent',
            title: 'Colors Accent',
            type: 'string',
            // validation: Rule => Rule.required()
        },
        {
            name: 'colorLightGrey',
            title: 'Colors Light Grey',
            type: 'string',
            // validation: Rule => Rule.required()
        },
        {
            name: 'colorGrey',
            title: 'Colors Grey',
            type: 'string',
            // validation: Rule => Rule.required()
        },
        {
            name: 'colorDarkGrey',
            title: 'Colors Dark Grey',
            type: 'string',
            // validation: Rule => Rule.required()
        },
        {
            name: 'nav',
            title: 'Navigation',
            type: 'array',
            of: [{type: 'reference', to: [
                {type: 'page'},
                {type: 'trailer'},
                {type: 'event'},
                {type: 'imagefilm'},
                {type: 'aboutUs'},
                {type: 'contact'},
            ]}]
        },
        {
            name: 'footerGetInTouch',
            title: 'Footerm Get in Touch',
            type: 'object',
            fields: [
                {
                    name: 'en',
                    title: 'English',
                    type: 'string'
                },
                {
                    name: 'de',
                    title: 'German',
                    type: 'string'
                }
            ]
        },
        {
            name: 'socialLinks',
            title: 'Social Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'Display name for the social link (e.g., "Vimeo", "Facebook", "Instagram")',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'workLabel',
                            title: 'Work Label',
                            type: 'string',
                            description: 'Optional label to indicate work/portfolio (e.g., "View Work", "Portfolio", "Showreel")'
                        },
                        {
                            name: 'iconType',
                            title: 'Icon Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Upload Custom Icon', value: 'image' },
                                    { title: 'Use Icon Name', value: 'name' }
                                ],
                                layout: 'radio'
                            },
                            initialValue: 'image',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'iconImage',
                            title: 'Custom Icon Image',
                            type: 'image',
                            description: 'Upload your custom icon image (SVG, PNG, or other format)',
                            options: {
                                accept: 'image/*'
                            },
                            fields: [
                                {
                                    name: 'alt',
                                    title: 'Alt Text',
                                    type: 'string',
                                    description: 'Alternative text for the icon (for accessibility)'
                                }
                            ],
                            hidden: ({ parent }) => parent?.iconType !== 'image'
                        },
                        {
                            name: 'iconName',
                            title: 'Icon Name',
                            type: 'string',
                            description: 'Icon identifier or name (e.g., "vimeo", "facebook", "instagram", or custom icon name). Only used if Icon Type is "Use Icon Name".',
                            hidden: ({ parent }) => parent?.iconType !== 'name'
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
                            label: 'label',
                            workLabel: 'workLabel',
                            url: 'url',
                            iconImage: 'iconImage',
                            iconName: 'iconName'
                        },
                        prepare({ label, workLabel, url, iconImage, iconName }) {
                            const subtitle = workLabel 
                                ? `${workLabel} - ${url || 'No URL'}`
                                : url || 'No URL'
                            return {
                                title: label || 'Social Link',
                                subtitle: subtitle,
                                media: iconImage || (() => null)
                            }
                        }
                    }
                }
            ]
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
