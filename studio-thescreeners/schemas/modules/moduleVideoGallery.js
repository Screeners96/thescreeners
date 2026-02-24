export default {
    name: "moduleVideoGallery",
    title: "Module Video Gallery",
    type: "object",
    fields: [
        {
            name: "flagTitle",
            title: "Flag",
            type: "object",
            fields: [
                { name: "en", title: "English", type: "string" },
                { name: "de", title: "German", type: "string" },
            ],
        },
        {
            name: 'items',
            title: 'Gallery Items',
            type: 'array',
            description: 'Mix of videos and images',
            of: [
                {
                    name: 'videoItem',
                    title: 'Video Item',
                    type: 'object',
                    fields: [
                        {
                            name: 'type',
                            title: 'Type',
                            type: 'string',
                            initialValue: 'video',
                            readOnly: true,
                            hidden: true
                        },
                        {
                            name: 'vimeoId',
                            title: 'Vimeo Video ID',
                            type: 'string',
                            description: 'The numeric ID from the Vimeo URL',
                            validation: Rule => Rule.required().regex(/^\d+$/, {
                                name: 'vimeoId',
                                invert: false
                            }).error('Please enter a valid Vimeo video ID (numbers only)')
                        },
                        {
                            name: 'illustrativeImage',
                            title: 'Illustrative Image',
                            type: 'image',
                            description: 'An image that will be shown before the video plays',
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
                    ],
                    preview: {
                        select: {
                            vimeoId: "vimeoId",
                            media: "illustrativeImage"
                        },
                        prepare({ vimeoId, media }) {
                            return {
                                title: `Video: ${vimeoId || 'No ID'}`,
                                media: media
                            }
                        }
                    }
                },
                {
                    name: 'imageItem',
                    title: 'Image Item',
                    type: 'object',
                    fields: [
                        {
                            name: 'type',
                            title: 'Type',
                            type: 'string',
                            initialValue: 'image',
                            readOnly: true,
                            hidden: true
                        },
                        {
                            name: 'image',
                            title: 'Image',
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
                    ],
                    preview: {
                        select: {
                            media: "image"
                        },
                        prepare({ media }) {
                            return {
                                title: "Image",
                                media: media
                            }
                        }
                    }
                }
            ]
        }
    ],
    preview: {
        select: {
            flagEn: "flagTitle.en",
            flagDe: "flagTitle.de",
            itemCount: "items"
        },
        prepare({ flagEn, flagDe, itemCount }) {
            const count = itemCount ? itemCount.length : 0
            return {
                title: flagEn || flagDe || "Video Gallery Module",
                subtitle: `Gallery - ${count} item${count !== 1 ? 's' : ''}`
            }
        }
    }
}

