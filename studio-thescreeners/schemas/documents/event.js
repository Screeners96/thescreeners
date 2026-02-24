import { CalendarIcon } from '@sanity/icons'
import { PAGE_FIELDS_REGULAR } from '../../constants'

const FIELDS = PAGE_FIELDS_REGULAR

export default {
    name: "event",
    title: "Event",
    type: "document",
    icon: CalendarIcon,
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

