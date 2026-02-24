import { DocumentTextIcon } from '@sanity/icons'
import { PAGE_FIELDS_MODULES } from '../../constants'

const EXTRA_FIELDS = []

const FIELDS = EXTRA_FIELDS.concat(PAGE_FIELDS_MODULES)

export default {
    name: "imagefilmSubpage",
    title: "Imagefilm Project",
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

