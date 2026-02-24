import { UserIcon } from '@sanity/icons'

export const aboutUs = (S) =>
    S.listItem()
        .title('About Us')
        .icon(UserIcon)
        .child(
            S.document()
                .schemaType('aboutUs')
                .documentId('aboutUs')
        )

