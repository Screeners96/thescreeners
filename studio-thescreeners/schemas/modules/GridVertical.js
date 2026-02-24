export default {
    name: "GridVertical",
    title: "Vertical Block (Single Entry)",
    type: "object",
    fields: [
        {
            name: "trailerPage",
            title: "Trailer Page",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Select a single trailer page to display in a full-height vertical block",
            validation: Rule => Rule.required()
        }
    ],
    preview: {
        select: {
            titleEn: "trailerPage.title.en",
            titleDe: "trailerPage.title.de",
            category: "trailerPage.category.title.en"
        },
        prepare({ titleEn, titleDe, category }) {
            const title = titleEn || titleDe || "Untitled"
            const categoryLabel = category ? ` (${category})` : ""
            return {
                title: "Vertical Block - Single Entry",
                subtitle: `${title}${categoryLabel}`
            }
        }
    }
}
