import { HomeIcon } from '@sanity/icons'

export const frontpage = (S) => 
S.listItem()
    .title('Frontpage + SEO')
    .icon(HomeIcon)
    .child(
        S.document()
        .schemaType('frontpage')
        .documentId('frontpage')
    )