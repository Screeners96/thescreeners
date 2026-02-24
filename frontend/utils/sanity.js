import { createClient } from "@sanity/client"

export const cmsClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "21f3spns",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2022-03-25",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export const cmsClientBrowser = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "21f3spns",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2022-03-25",
  useCdn: true,
})

export const RTE = `{
    ...,
    markDefs[] {
        ...,
        _type == "internalLink" => {
            ...,
            "slug": coalesce(reference->slug.current, reference->store.slug.current),
            "docType": reference->_type,
        },
    }   
}`

// Base wrapper fields (non-recursive)
const BaseWrapperFields = `
_type,
_key,
_type == "wrapperTextBig" => {
    ...,
    bodyText {
        en[] ${RTE},
        de[] ${RTE}
    }
},
_type == "wrapperSubtitle" => {
    ...,
    subtitle {
        en,
        de
    },
    bodyText {
        en[] ${RTE},
        de[] ${RTE}
    },
    color
},
_type == "wrapperTitle" => {
    ...,
    title {
        en,
        de
    }
},
_type == "wrapperImage" => {
    ...,
    image {
        ...,
        asset->,
        alt
    }
},
_type == "wrapperVideo" => {
    ...,
    video {
        asset->,
        alt
    },
    posterImage {
        ...,
        asset->,
        alt
    },
    autoplay,
    loop,
    muted
},
`

// Wrapper fields for About Us grids (with recursion)
export const WrapperFields = `
${BaseWrapperFields}
_type == "wrapperGrid1Top2bottom" => {
    ...,
    top[] {
        ${BaseWrapperFields}
    },
    bottomLeft[] {
        ${BaseWrapperFields}
    },
    bottomRight[] {
        ${BaseWrapperFields}
    }
},
_type == "wrapperGrid2Top1Bottom" => {
    ...,
    top[] {
        ${BaseWrapperFields}
    },
    bottomLeft[] {
        ${BaseWrapperFields}
    },
    bottomRight[] {
        ${BaseWrapperFields}
    }
},
_type == "wrapperGridVertical" => {
    ...,
    wrapper[] {
        ${BaseWrapperFields}
    }
},
_type == "wrapperGrid3Vertical" => {
    ...,
    top[] {
        ${BaseWrapperFields}
    },
    middle[] {
        ${BaseWrapperFields}
    },
    bottom[] {
        ${BaseWrapperFields}
    }
},
`

// Project modules for subpages
export const ProjectModulesFields = `
_type,
_key,
_type == "projectModuleImage" => {
    ...,
    image {
        ...,
        asset->,
        alt
    }
},
_type == "projectModuleVimeo" => {
    ...,
    vimeoId,
    alt
},
_type == "projectModuleVideo" => {
    ...,
    video {
        ...,
        asset->,
        alt
    },
    poster {
        ...,
        asset->,
        alt
    },
    autoplay,
    loop,
    muted
},
_type == "projectModuleSlider" => {
    ...,
    images[] {
        ...,
        image {
            ...,
            asset->,
            alt
        }
    },
    slides[] {
        ...,
        image {
            ...,
            asset->,
            alt
        }
    }
},
`

// Grid fields for trailer/event/imagefilm pages
export const GridFields = `
_type,
_key,
_type == "GridVertical" => {
    ...,
    trailerPage-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        category-> {
            _id,
            title,
            "slug": slug.current,
            order
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    }
},
_type == "Grid3Bottom" => {
    ...,
    topLeft-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    topRight-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    bottom-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    }
},
_type == "Grid3Top" => {
    ...,
    top-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    bottomLeft-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    bottomRight-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    }
},
_type == "Grid3Vertical" => {
    ...,
    top-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    middle-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    bottom-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    }
},
_type == "GridFull" => {
    ...,
    trailerPage-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        category-> {
            _id,
            title,
            "slug": slug.current,
            order
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    },
    item-> {
        _id,
        _type,
        title,
        "slug": slug.current,
        teaserImage {
            ...,
            asset->,
            alt
        },
        bodyText {
            en[] ${RTE},
            de[] ${RTE}
        },
        projectModules[] {
            ...,
            ${ProjectModulesFields}
        }
    }
},
`

export const ModulesFields = `
_type,
_key,
flagTitle {
  en,
  de
},
_type == "moduleImage" => {
    ...,
    image {
        ...,
        asset->,
        alt
    }
},
_type == "moduleSlider" => {
    ...,
    slides[] {
        ...,
        image {
            ...,
            asset->,
            alt
        }
    }
},
_type == "moduleSpace" => {
    ...,
    height,
    backgroundColor
},
_type == "moduleText" => {
    ...,
    bodyText {
        en[] ${RTE},
        de[] ${RTE}
    }
},
_type == "moduleVideo" => {
    ...,
    vimeoId,
    illustrativeImage {
        ...,
        asset->,
        alt
    }
},
_type == "moduleVideoGallery" => {
    ...,
    items[] {
        ...,
        _type == "videoItem" => {
            vimeoId,
            illustrativeImage {
                ...,
                asset->,
                alt
            }
        },
        _type == "imageItem" => {
            image {
                ...,
                asset->,
                alt
            }
        }
    }
},
`

// Base settings fields that should be included in all settings queries
export const settingsFields = `
  ...,
  colorsAccent,
  colorLightGrey,
  colorGrey,
  colorDarkGrey,
  footerGetInTouch,
`

export const globalQuery = `*[_type == "settings"][0] {
  ${settingsFields}
  socialLinks[] {
    label,
    workLabel,
    iconType,
    iconImage {
      ...,
      asset->
    },
    iconName,
    url
  },
  "nav": nav[]-> {
    _id,
    _type,
    title,
    "slug": slug.current,
    "navTitle": title,
    "navSlug": slug.current,
    "navType": _type
  },
  "impressumTitle": *[_type == "page" && slug.current == "impressum"][0].title
}`

// Fetch all pages with titles and body text for debugging
export const fetchAllPagesQuery = `{
  "pages": *[_type == "page" && defined(slug.current) && slug.current != null && slug.current != ""] {
    _id,
    _type,
    "slug": slug.current,
    title {
      en,
      de
    },
    bodyText {
      en[] ${RTE},
      de[] ${RTE}
    },
    description {
      en,
      de
    }
  },
  "frontpage": *[_type == "frontpage"][0] {
    _id,
    _type,
    "slug": "frontpage",
    bodyText {
      en[] ${RTE},
      de[] ${RTE}
    },
    description {
      en,
      de
    },
    modules[] {
      ...,
      ${ModulesFields}
    }
  },
  "aboutUs": *[_type == "aboutUs"][0] {
    _id,
    _type,
    "slug": "about-us",
    title {
      en,
      de
    },
    description {
      en,
      de
    },
    grids[] {
      ...,
      ${WrapperFields}
    }
  },
  "contact": *[_type == "contact"][0] {
    _id,
    _type,
    "slug": "contact",
    title {
      en,
      de
    },
    subtitle {
      en[] ${RTE},
      de[] ${RTE}
    },
    description {
      en,
      de
    },
    infoItems[] {
      _type,
      _key,
      _type == "infoAddress" => {
        title {
          en,
          de
        },
        bodyText {
          en[] ${RTE},
          de[] ${RTE}
        }
      },
      _type == "infoTitle" => {
        title {
          en,
          de
        }
      },
      _type == "infoLink" => {
        title {
          en,
          de
        },
        url
      },
      _type == "infoEmail" => {
        title {
          en,
          de
        },
        email
      },
      _type == "infoPhone" => {
        title {
          en,
          de
        },
        phone
      }
    }
  },
  "event": *[_type == "event"][0] {
    _id,
    _type,
    "slug": "event",
    title {
      en,
      de
    },
    description {
      en,
      de
    },
    bodyText {
      en[] ${RTE},
      de[] ${RTE}
    }
  },
  "imagefilm": *[_type == "imagefilm"][0] {
    _id,
    _type,
    "slug": "imagefilm",
    title {
      en,
      de
    },
    description {
      en,
      de
    }
  },
  "trailer": *[_type == "trailer"][0] {
    _id,
    _type,
    "slug": "trailer",
    title {
      en,
      de
    },
    description {
      en,
      de
    }
  },
  "datenschutz": *[_type == "datenschutz"][0] {
    _id,
    _type,
    "slug": "datenschutz",
    title {
      en,
      de
    },
    sections[] {
      sectionTitle {
        en,
        de
      },
      content {
        en[] ${RTE},
        de[] ${RTE}
      }
    }
  },
  "impressum": *[_type == "impressum"][0] {
    _id,
    _type,
    "slug": "impressum",
    title {
      en,
      de
    },
    companyName,
    legalForm,
    street,
    city,
    country,
    phone,
    email,
    website,
    registrationCourt,
    registrationNumber,
    vatId,
    taxNumber,
    responsiblePerson,
    content {
      en[] ${RTE},
      de[] ${RTE}
    },
    description {
      en,
      de
    }
  }
}`
