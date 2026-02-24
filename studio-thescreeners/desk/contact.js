import { EnvelopeIcon } from '@sanity/icons'

export const contact = (S) =>
    S.listItem()
        .title('Contact')
        .icon(EnvelopeIcon)
        .child(
            S.document()
                .schemaType('contact')
                .documentId('contact')
        )

