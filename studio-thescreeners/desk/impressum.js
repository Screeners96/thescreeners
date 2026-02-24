import { DocumentTextIcon } from '@sanity/icons'

export const impressum = (S) =>
    S.listItem()
        .title('Impressum')
        .icon(DocumentTextIcon)
        .child(
            S.document()
                .schemaType('impressum')
                .documentId('impressum')
        )

