import { CalendarIcon } from '@sanity/icons'

export const event = (S) =>
    S.listItem()
        .title('Event')
        .icon(CalendarIcon)
        .child(
            S.document()
                .schemaType('event')
                .documentId('event')
        )

