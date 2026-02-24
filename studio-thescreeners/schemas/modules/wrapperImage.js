export default {
    name: "wrapperImage",
    title: "Image (Image Wrapper)",
    type: "object",
    fields: [
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
            ],
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            media: 'image'
        },
        prepare({ media }) {
            return {
                title: "Image (Image Wrapper)",
                subtitle: "Image",
                media: media
            }
        }
    }
}
