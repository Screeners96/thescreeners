import { BASIC_BLOCK } from '../../constants'

export default {
    name: "aboutUsModuleTextBig",
    title: "About Us - Text (Big Wrapper)",
    type: "object",
    fields: [
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
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            bodyTextEn: 'bodyText.en',
            bodyTextDe: 'bodyText.de'
        },
        prepare({ bodyTextEn, bodyTextDe }) {
            const text = bodyTextEn?.[0]?.children?.[0]?.text || bodyTextDe?.[0]?.children?.[0]?.text || 'Empty'
            return {
                title: "Text (Big Wrapper)",
                subtitle: text.substring(0, 50) + (text.length > 50 ? '...' : '')
            }
        }
    }
}
