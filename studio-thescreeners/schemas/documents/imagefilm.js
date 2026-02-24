import { DocumentTextIcon } from '@sanity/icons'
import { PAGE_FIELDS_REGULAR } from '../../constants'

const FIELDS = PAGE_FIELDS_REGULAR

export default {
    name: "imagefilm",
    title: "Imagefilm",
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

