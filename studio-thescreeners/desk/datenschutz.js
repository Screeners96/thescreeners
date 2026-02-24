import { DocumentTextIcon } from '@sanity/icons'

export const datenschutz = (S) =>
    S.listItem()
        .title('Datenschutz')
        .icon(DocumentTextIcon)
        .child(
            S.document()
                .schemaType('datenschutz')
                .documentId('datenschutz')
        )

