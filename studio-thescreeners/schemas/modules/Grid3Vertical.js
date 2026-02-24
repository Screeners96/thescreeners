export default {
    name: "Grid3Vertical",
    title: "3 Entrees Vertical Stack",
    type: "object",
    fields: [
        {
            name: "top",
            title: "Top Entry",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "First trailer page (top of the stack)",
            validation: Rule => Rule.required()
        },
        {
            name: "middle",
            title: "Middle Entry",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Second trailer page (middle of the stack)",
            validation: Rule => Rule.required()
        },
        {
            name: "bottom",
            title: "Bottom Entry",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Third trailer page (bottom of the stack)",
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            topTitle: "top.title.en",
            middleTitle: "middle.title.en",
            bottomTitle: "bottom.title.en"
        },
        prepare({ topTitle, middleTitle, bottomTitle }) {
            const top = topTitle || "Untitled"
            const middle = middleTitle || "Untitled"
            const bottom = bottomTitle || "Untitled"
            return {
                title: "3 Entrees - Vertical Stack",
                subtitle: `${top} | ${middle} | ${bottom}`
            }
        }
    }
}
