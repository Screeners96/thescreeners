import {DocumentTextIcon} from '@sanity/icons'
import {PAGE_FIELDS_REGULAR} from '../../constants'

const EXTRA_FIELDS = []
const FIELDS = EXTRA_FIELDS.concat(PAGE_FIELDS_REGULAR)

export default {
    name: "page",
    title: "Page",
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
