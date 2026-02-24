export default {
    name: "moduleVideo",
    title: "Module Video",
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
            name: 'vimeoId',
            title: 'Vimeo Video ID',
            type: 'string',
            description: 'The numeric ID from the Vimeo URL (e.g., for https://vimeo.com/123456789, enter 123456789)',
            validation: Rule => Rule.required().regex(/^\d+$/, {
                name: 'vimeoId',
                invert: false
            }).error('Please enter a valid Vimeo video ID (numbers only)')
        },
        {
            name: 'illustrativeImage',
            title: 'Illustrative Image',
            type: 'image',
            description: 'An image that will be shown before the video plays or as a placeholder',
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
            flagEn: "flagTitle.en",
            flagDe: "flagTitle.de",
            vimeoId: "vimeoId",
            media: "illustrativeImage"
        },
        prepare({ flagEn, flagDe, vimeoId, media }) {
            return {
                title: flagEn || flagDe || "Video Module",
                subtitle: `Vimeo: ${vimeoId || 'No ID'}`,
                media: media
            }
        }
    }
}

