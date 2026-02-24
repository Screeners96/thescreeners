export default {
    name: "moduleSlider",
    title: "Module Slider",
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
            title: "Slides",
            name: "slides",
            type: "array",
            of: [{
                name: "slide",
                title: "Slide",
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
                        ]
                    },
                ],
                preview: {
                    select: {
                        media: "image"
                    },
                    prepare({ media }) {
                        return {
                            title: "Slide",
                            media: media
                        }
                    }
                }
            }]
        }
    ],
    preview: {
        select: {
            flagEn: "flagTitle.en",
            flagDe: "flagTitle.de",
            slideCount: "slides"
        },
        prepare({ flagEn, flagDe, slideCount }) {
            const count = slideCount ? slideCount.length : 0
            return {
                title: flagEn || flagDe || "Slider Module",
                subtitle: `Slider - ${count} slide${count !== 1 ? 's' : ''}`
            }
        }
    }
}