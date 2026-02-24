export default {
    name: "projectModuleImage",
    title: "Project Image",
    type: "object",
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            description: 'Cinematic format (wide aspect ratio)',
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
            media: "image"
        },
        prepare({ media }) {
            return {
                title: "Project Image",
                subtitle: "Image",
                media: media
            }
        }
    }
}
