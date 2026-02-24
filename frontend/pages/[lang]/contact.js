import { cmsClient, RTE } from "@/utils/sanity"
import Contact from "@/components/pages/contact/contact"

const ContactPage = ({ pageData, globalData, preview, lang, rawPageData }) => {
  return <Contact pageData={pageData} globalData={globalData} preview={preview} lang={lang} rawPageData={rawPageData} />
}

export default ContactPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    
    // Debug: Log navigation data
    console.log('=== CONTACT PAGE NAVIGATION DEBUG ===')
    console.log('globalDataRaw.nav exists?', !!globalDataRaw.nav)
    console.log('globalDataRaw.nav type:', typeof globalDataRaw.nav)
    console.log('globalDataRaw.nav length:', globalDataRaw.nav?.length ?? 'undefined')
    if (globalDataRaw.nav && Array.isArray(globalDataRaw.nav)) {
      console.log('Navigation items:', globalDataRaw.nav.map(item => ({
        _id: item._id,
        _type: item._type,
        title: item.title,
        navTitle: item.navTitle,
        navSlug: item.navSlug,
        navType: item.navType,
        slug: item.slug
      })))
    }
    console.log('=====================================')
    
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get contact page (singleton) - fetch ALL fields including RTE expansion
    const pageDataRaw = await cmsClient.fetch(`*[_type == "contact"][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
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
      },
      googleMaps {
        apiKey,
        latitude,
        longitude
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
      },
      "slug": slug.current
    }`)

    if (!pageDataRaw) {
      return { notFound: true }
    }

    // Keep raw data for display
    const rawPageData = pageDataRaw

    // Process data for component use - keep subtitle and bodyText as arrays for RTE
    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      subtitle: pageDataRaw?.subtitle?.[lang] || pageDataRaw?.subtitle?.en || [],
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || [],
      description: pageDataRaw?.description?.[lang] || pageDataRaw?.description?.en || "",
      googleMaps: pageDataRaw?.googleMaps || null,
      infoItems: (pageDataRaw?.infoItems || []).map(item => {
        if (item._type === 'infoAddress') {
          return {
            ...item,
            title: typeof item.title === 'object' ? item.title[lang] || item.title.en : item.title,
            bodyText: typeof item.bodyText === 'object' ? (item.bodyText[lang] || item.bodyText.en || []) : item.bodyText,
          }
        }
        if (item._type === 'infoTitle' || item._type === 'infoLink' || item._type === 'infoEmail' || item._type === 'infoPhone') {
          return {
            ...item,
            title: typeof item.title === 'object' ? item.title[lang] || item.title.en : item.title,
          }
        }
        return item
      }),
    }

    return {
      props: { globalData, pageData, preview, lang, rawPageData },
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { lang: "en" } }, { params: { lang: "de" } }],
    fallback: false,
  }
}

const globalQuery = `*[_type == "settings"][0] {
  ...,
  colorsAccent,
  colorLightGrey,
  colorGrey,
  colorDarkGrey,
  footerGetInTouch,
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
  nav[]-> {
    _id,
    _type,
    title {
      en,
      de
    },
    "slug": slug.current,
    "navTitle": title {
      en,
      de
    },
    "navSlug": slug.current,
    "navType": _type
  }
}`

