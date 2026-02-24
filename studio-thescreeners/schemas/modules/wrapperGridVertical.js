export default {
    name: "wrapperGridVertical",
    title: "Vertical Wrapper",
    type: "object",
    fields: [
        {
            name: "wrapper",
            title: "Wrapper",
            type: "array",
            of: [
                { type: "wrapperTextBig" },
                { type: "wrapperSubtitle" },
                { type: "wrapperTitle" },
                { type: "wrapperImage" },
                { type: "wrapperVideo" }
            ],
            description: "Single vertical wrapper - select one module type",
            validation: Rule => Rule.required().max(1).error('Please select exactly one wrapper')
        }
    ],
    preview: {
        select: {
            wrapperType: "wrapper.0._type"
        },
        prepare({ wrapperType }) {
            return {
                title: "Vertical Wrapper",
                subtitle: wrapperType || 'No wrapper selected'
            }
        }
    }
}
