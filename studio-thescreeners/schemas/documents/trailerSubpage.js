import { DocumentTextIcon } from '@sanity/icons'
import { PAGE_FIELDS_MODULES } from '../../constants'

const EXTRA_FIELDS = [
    {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{ type: 'trailerCategory' }],
        validation: Rule => Rule.required()
    }
]

const FIELDS = EXTRA_FIELDS.concat(PAGE_FIELDS_MODULES)

export default {
    name: "trailerSubpage",
    title: "Trailer Project",
    type: "document",
    icon: DocumentTextIcon,
    fields: FIELDS,
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de',
            categoryTitleEn: 'category.title.en',
            categoryTitleDe: 'category.title.de'
        },
        prepare({ titleEn, titleDe, categoryTitleEn, categoryTitleDe }) {
            const title = titleEn || titleDe || 'Untitled'
            const categoryTitle = categoryTitleEn || categoryTitleDe
            const categoryLabel = categoryTitle ? ` (${categoryTitle})` : ''
            return {
                title: `${title}${categoryLabel}`
            }
        }
    }
}

