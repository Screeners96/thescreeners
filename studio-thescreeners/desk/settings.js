import { CogIcon } from '@sanity/icons'

export const settings = (S) => 
S.listItem()
    .title('Settings')
    .icon(CogIcon)
    .child(
        S.document()
        .schemaType('settings')
        .documentId('settings')
    )