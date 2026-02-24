export default {
    name: "Grid3Top",
    title: "3 Entrees (Full Width Top, 1/2 Width Bottom)",
    type: "object",
    fields: [
        {
            name: "top",
            title: "Top (Full Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "First trailer page for the top row (full width)",
            validation: Rule => Rule.required()
        },
        {
            name: "bottomLeft",
            title: "Bottom Left (1/2 Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Second trailer page for the bottom row (left half)",
            validation: Rule => Rule.required()
        },
        {
            name: "bottomRight",
            title: "Bottom Right (1/2 Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Third trailer page for the bottom row (right half)",
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            topTitle: "top.title.en",
            bottomLeftTitle: "bottomLeft.title.en",
            bottomRightTitle: "bottomRight.title.en"
        },
        prepare({ topTitle, bottomLeftTitle, bottomRightTitle }) {
            const top = topTitle || "Untitled"
            const bottomLeft = bottomLeftTitle || "Untitled"
            const bottomRight = bottomRightTitle || "Untitled"
            return {
                title: "3 Entrees - Full Width Top",
                subtitle: `Top: ${top} | Bottom: ${bottomLeft}, ${bottomRight}`
            }
        }
    }
}
