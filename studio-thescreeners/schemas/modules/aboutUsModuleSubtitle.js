import { BASIC_BLOCK } from '../../constants'

export default {
    name: "aboutUsModuleSubtitle",
    title: "About Us - Subtitle + Body Text + Color (Small/Normal Wrapper)",
    type: "object",
    fields: [
        {
            name: 'subtitle',
            title: 'Subtitle',
            type: 'object',
            fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
            ],
        },
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
        },
        {
            name: 'color',
            title: 'Color',
            type: 'string',
            description: 'Color for this wrapper (hex code, e.g., #FF0000)',
            validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                name: 'hexColor',
                invert: false
            }).error('Please enter a valid hex color code (e.g., #FF0000)')
        }
    ],
    preview: {
        select: {
            subtitleEn: 'subtitle.en',
            subtitleDe: 'subtitle.de',
            color: 'color'
        },
        prepare({ subtitleEn, subtitleDe, color }) {
            const subtitle = subtitleEn || subtitleDe || 'No subtitle'
            const colorLabel = color ? ` (${color})` : ''
            return {
                title: "Subtitle + Body Text + Color",
                subtitle: `${subtitle}${colorLabel}`
            }
        }
    }
}
