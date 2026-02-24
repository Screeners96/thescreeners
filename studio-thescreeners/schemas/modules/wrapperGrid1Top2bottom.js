export default {
    name: "wrapperGrid1Top2bottom",
    title: "1 Top, 2 Bottom",
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
            description: "Wrapper for the top row (full width of 2 columns) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        },
        {
            name: "bottomLeft",
            title: "Bottom Left Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "First wrapper for the bottom row (left, 50% width) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        },
        {
            name: "bottomRight",
            title: "Bottom Right Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "Second wrapper for the bottom row (right, 50% width) - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        }
    ],
    preview: {
        select: {
            topType: "top.0._type",
            bottomLeftType: "bottomLeft.0._type",
            bottomRightType: "bottomRight.0._type"
        },
        prepare({ topType, bottomLeftType, bottomRightType }) {
            return {
                title: "1 Top, 2 Bottom",
                subtitle: `Top: ${topType || '?'} | Bottom: ${bottomLeftType || '?'}, ${bottomRightType || '?'}`
            }
        }
    }
}
