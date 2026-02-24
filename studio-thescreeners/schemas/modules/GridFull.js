export default {
    name: "GridFull",
    title: "Full Width & Height Entry",
    type: "object",
    fields: [
        {
            name: "trailerPage",
            title: "Trailer Page",
            type: "reference",
            to: [{ type: "trailerSubpage" }],
            description: "Select a trailer page to display in a full-width and full-height responsive block that adapts to surrounding content (not rectangular)",
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
                title: "Full Width & Height - Responsive",
                subtitle: `${title}${categoryLabel}`
            }
        }
    }
}
