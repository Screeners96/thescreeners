export default {
    name: "Grid3Bottom",
    title: "3 Entrees (Full Width Bottom, 1/2 Width Top)",
    type: "object",
    fields: [
        {
            name: "topLeft",
            title: "Top Left (1/2 Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "First trailer page for the top row (left half)",
            validation: Rule => Rule.required()
        },
        {
            name: "topRight",
            title: "Top Right (1/2 Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Second trailer page for the top row (right half)",
            validation: Rule => Rule.required()
        },
        {
            name: "bottom",
            title: "Bottom (Full Width)",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Third trailer page for the bottom row (full width)",
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            topLeftTitle: "topLeft.title.en",
            topRightTitle: "topRight.title.en",
            bottomTitle: "bottom.title.en"
        },
        prepare({ topLeftTitle, topRightTitle, bottomTitle }) {
            const topLeft = topLeftTitle || "Untitled"
            const topRight = topRightTitle || "Untitled"
            const bottom = bottomTitle || "Untitled"
            return {
                title: "3 Entrees - Full Width Bottom",
                subtitle: `Top: ${topLeft}, ${topRight} | Bottom: ${bottom}`
            }
        }
    }
}
