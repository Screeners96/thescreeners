export default {
    name: "projectModuleSlider",
    title: "Project Image Slider",
    type: "object",
    fields: [
        {
            title: "Images",
            name: "images",
            type: "array",
            of: [{
                type: "object",
                name: "sliderImageItem",
                title: "Slider Image",
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
                            title: "Slider Image",
                            media: media
                        }
                    }
                }
            }],
            validation: Rule => Rule.min(1).error('At least one image is required')
        }
    ],
    preview: {
        select: {
            imageCount: "images"
        },
        prepare({ imageCount }) {
            const count = imageCount ? imageCount.length : 0
            return {
                title: "Project Image Slider",
                subtitle: `${count} image${count !== 1 ? 's' : ''}`
            }
        }
    }
}
