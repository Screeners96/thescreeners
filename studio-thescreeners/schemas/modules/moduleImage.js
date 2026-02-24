export default {
    name: "moduleImage",
    title: "Module Image",
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
            flagEn: "flagTitle.en",
            flagDe: "flagTitle.de",
            media: "image"
        },
        prepare({ flagEn, flagDe, media }) {
            return {
                title: flagEn || flagDe || "Image Module",
                subtitle: "Image",
                media: media
            }
        }
    }
}

