export default {
    name: "wrapperGrid3Vertical",
    title: "3 Vertical Stack",
    type: "object",
    fields: [
        {
            name: "top",
            title: "Top Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "First wrapper (top of stack) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        },
        {
            name: "middle",
            title: "Middle Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "Second wrapper (middle of stack) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        },
        {
            name: "bottom",
            title: "Bottom Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "Third wrapper (bottom of stack) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        }
    ],
    preview: {
        select: {
            topType: "top.0._type",
            middleType: "middle.0._type",
            bottomType: "bottom.0._type"
        },
        prepare({ topType, middleType, bottomType }) {
            return {
                title: "3 Vertical Stack",
                subtitle: `${topType || '?'} | ${middleType || '?'} | ${bottomType || '?'}`
            }
        }
    }
}
