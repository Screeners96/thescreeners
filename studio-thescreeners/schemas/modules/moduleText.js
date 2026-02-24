import { BASIC_BLOCK } from "../../constants"

export default {
    name: "moduleText",
    title: "Module Text",
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
        }
    ],
    preview: {
        select: {
            flagEn: "flagTitle.en",
            flagDe: "flagTitle.de"
        },
        prepare({ flagEn, flagDe }) {
            return {
                title: flagEn || flagDe || "Text Module",
                subtitle: "Text"
            }
        }
    }
}
