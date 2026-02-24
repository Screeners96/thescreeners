import { DocumentTextIcon } from '@sanity/icons'

export const trailer = (S) =>
    S.listItem()
        .title('Trailer')
        .icon(DocumentTextIcon)
        .child(
            S.document()
                .schemaType('trailer')
                .documentId('trailer')
        )

