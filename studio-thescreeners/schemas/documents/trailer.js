import { DocumentTextIcon } from '@sanity/icons'
import { PAGE_FIELDS_TRAILER } from '../../constants'

const FIELDS = [
    ...PAGE_FIELDS_TRAILER.slice(0, 2), // title and bodyText
    {
        name: 'categoriesOrder',
        title: 'Trailer Categories Order',
        type: 'array',
        description: 'Drag and drop to reorder the trailer categories. Only categories added here will be displayed.',
        of: [{
            type: 'reference', 
            to: [{type: 'trailerCategory'}]
        }]
    },
    ...PAGE_FIELDS_TRAILER.slice(2) // description and slug
]

export default {
    name: "trailer",
    title: "Trailer",
    type: "document",
    icon: DocumentTextIcon,
    fields: FIELDS,
    
    preview: {
        select: {
            titleEn: 'title.en',
            titleDe: 'title.de'
        },
        prepare({ titleEn, titleDe }) {
            return {
                title: titleEn || titleDe || 'Untitled'
            }
        }
    }
}

