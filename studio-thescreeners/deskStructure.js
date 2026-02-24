
  import {frontpage} from './desk/frontpage'
  import {settings} from './desk/settings'
  import {trailer} from './desk/trailer'
  import {event} from './desk/event'
  import {imagefilm} from './desk/imagefilm'
  import {aboutUs} from './desk/aboutUs'
  import {contact} from './desk/contact'
  import {impressum} from './desk/impressum'
  import {datenschutz} from './desk/datenschutz'
  import { DocumentTextIcon, CalendarIcon, UserIcon } from '@sanity/icons'

  const DOCUMENT_TYPES_IN_STRUCTURE = [
      'frontpage',
      'settings',
      'contact',
      'impressum',
      'datenschutz',
      'trailer',
      'trailerCategory',
      'trailerSubpage',
      'event',
      'eventSubpage',
      'imagefilm',
      'imagefilmSubpage',
      'aboutUs',
      'aboutUsSubpage',
      'media.tag'
  ]

  export default (S) =>
    S.list()
      .title('Content')
      .items([
          frontpage(S),
          settings(S),
          S.divider(),
          S.listItem()
              .title('Trailer')
              .icon(DocumentTextIcon)
              .child(
                  S.list()
                      .title('Trailer')
                      .items([
                          trailer(S),
                          S.listItem()
                              .title('Trailer Categories')
                              .child(
                                  S.documentTypeList('trailerCategory')
                                      .title('Trailer Categories')
                                      .defaultOrdering([{ field: 'order', direction: 'asc' }])
                              ),
                          S.listItem()
                              .title('Trailer Projects')
                              .child(
                                  S.documentTypeList('trailerSubpage')
                                      .title('Trailer Projects')
                              )
                      ])
              ),
          S.listItem()
              .title('Event')
              .icon(CalendarIcon)
              .child(
                  S.list()
                      .title('Event')
                      .items([
                          event(S),
                          S.listItem()
                              .title('Event Projects')
                              .child(
                                  S.documentTypeList('eventSubpage')
                                      .title('Event Projects')
                              )
                      ])
              ),
          S.listItem()
              .title('Imagefilm')
              .icon(DocumentTextIcon)
              .child(
                  S.list()
                      .title('Imagefilm')
                      .items([
                          imagefilm(S),
                          S.listItem()
                              .title('Imagefilm Projects')
                              .child(
                                  S.documentTypeList('imagefilmSubpage')
                                      .title('Imagefilm Projects')
                              )
                      ])
              ),
          S.divider(),
          S.listItem()
              .title('About Us')
              .icon(UserIcon)
              .child(
                  S.list()
                      .title('About Us')
                      .items([
                          aboutUs(S),
                          S.listItem()
                              .title('About Us Sections')
                              .child(
                                  S.documentTypeList('aboutUsSubpage')
                                      .title('About Us Sections')
                              )
                      ])
              ),
          contact(S),
          S.divider(),
          impressum(S),
          datenschutz(S),
          S.divider()
        //   ...S.documentTypeListItems().filter(item => !DOCUMENT_TYPES_IN_STRUCTURE.includes(item.getId()))
      ])
