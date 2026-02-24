export default {
    name: "wrapperTitle",
    title: "Title (Text Wrapper)",
    type: "object",
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
            ],
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de'
        },
        prepare({ titleEn, titleDe }) {
            const title = titleEn || titleDe || 'Untitled'
            return {
                title: "Title (Text Wrapper)",
                subtitle: title
            }
        }
    }
}
