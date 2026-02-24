import { BASIC_BLOCK } from '../../constants'

export default {
    name: "wrapperSubtitle",
    title: "Subtitle + Body Text + Color (Small/Normal Wrapper)",
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
            description: 'Choose background color for this wrapper',
            options: {
                list: [
                    { title: 'Grey', value: 'grey' },
                    { title: 'Black', value: 'black' }
                ],
                layout: 'radio'
            },
            initialValue: 'grey'
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
