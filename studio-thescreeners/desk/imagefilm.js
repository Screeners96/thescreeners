import { DocumentTextIcon } from '@sanity/icons'

export const imagefilm = (S) =>
    S.listItem()
        .title('Imagefilm')
        .icon(DocumentTextIcon)
        .child(
            S.document()
                .schemaType('imagefilm')
                .documentId('imagefilm')
        )

