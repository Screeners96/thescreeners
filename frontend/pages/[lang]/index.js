import { cmsClient, ModulesFields, RTE } from "@/utils/sanity"
import Frontpage from "@/components/pages/frontpage/frontpage"

const PageFront = ({ pageData, globalData, preview, lang }) => {
  return <Frontpage pageData={pageData} globalData={globalData} lang={lang} />
}

export default PageFront

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    
    // Debug: Log navigation data - Check terminal/server logs for these
    console.log('=== LANDING PAGE DEBUG ===')
    console.log('globalDataRaw exists?', !!globalDataRaw)
    console.log('globalDataRaw keys:', Object.keys(globalDataRaw || {}))
    console.log('globalDataRaw.nav:', globalDataRaw.nav)
    console.log('globalDataRaw.nav type:', typeof globalDataRaw.nav)
    console.log('globalDataRaw.nav length:', globalDataRaw.nav?.length ?? 'undefined')
    if (globalDataRaw.nav && Array.isArray(globalDataRaw.nav)) {
      console.log('First nav item:', JSON.stringify(globalDataRaw.nav[0], null, 2))
    }
    console.log('=========================')
    
    // Fetch impressumTitle separately to avoid nested query issues
    const impressumTitle = await cmsClient.fetch(`*[_type == "page" && slug.current == "impressum"][0].title`)
    
    // Fetch contact email from contact page
    let contactEmail = null
    try {
      const contactData = await cmsClient.fetch(`*[_type == "contact"][0]{
        infoItems[] {
          _type,
          _key,
          _type == "infoEmail" => {
            email
          }
        }
      }`)
      
      // Extract first email from infoItems
      if (contactData?.infoItems && Array.isArray(contactData.infoItems)) {
        const emailItem = contactData.infoItems.find(item => item._type === "infoEmail" && item.email)
        contactEmail = emailItem?.email || null
      }
    } catch (contactError) {
      console.warn("Error fetching contact email:", contactError)
      contactEmail = null
    }
    
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
      impressumTitle: impressumTitle || null,
      contactEmail: contactEmail,
      // Ensure nav is always an array
      nav: globalDataRaw.nav || [],
    }
    
    // Debug: Verify nav in globalData
    console.log('Landing page - globalData.nav:', globalData.nav)
    console.log('Landing page - globalData.nav length:', globalData.nav?.length || 0)

    const pageDataRaw = await cmsClient.fetch(`*[_type == "frontpage"][0]{
      _id,
      _type,
      title,
      heroMediaType,
      heroImage {
        ...,
        asset->,
        alt
      },
      heroSlider[] {
        ...,
        asset->,
        alt
      },
      heroVideo {
        ...,
        asset->,
        alt,
        poster {
          ...,
          asset->,
          alt
        },
        autoplay,
        loop,
        muted
      },
      bodyText {
        en,
        de
      },
      description {
        en,
        de
      },
      modules[] {
        ...,
        ${ModulesFields}
      },
      seoTitle {
        en,
        de
      },
      seoDescription {
        en,
        de
      },
      seoKeywords {
        en,
        de
      },
      canonicalUrl,
      robotsMeta {
        noindex,
        nofollow,
        noarchive,
        nosnippet
      },
      openGraph {
        ogTitle {
          en,
          de
        },
        ogDescription {
          en,
          de
        },
        ogImage {
          ...,
          asset->
        },
        ogType,
        ogSiteName,
        ogUrl
      },
      twitterCard {
        cardType,
        twitterTitle {
          en,
          de
        },
        twitterDescription {
          en,
          de
        },
        twitterImage {
          ...,
          asset->
        },
        twitterSite,
        twitterCreator
      },
      schemaOrg {
        enableSchema,
        schemaType,
        schemaName {
          en,
          de
        },
        schemaDescription {
          en,
          de
        },
        schemaImage {
          ...,
          asset->
        },
        schemaDatePublished,
        schemaDateModified,
        schemaAuthor {
          name,
          url
        }
      },
      additionalMetaTags[] {
        name,
        content
      }
    }`)

    // Process the multilingual data
    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || null,
      description: pageDataRaw?.description?.[lang] || pageDataRaw?.description?.en || "",
      modules: pageDataRaw?.modules || [],
      heroMediaType: pageDataRaw?.heroMediaType || "image",
      heroImage: pageDataRaw?.heroImage || null,
      heroSlider: pageDataRaw?.heroSlider || [],
      heroVideo: pageDataRaw?.heroVideo || null,
      seoTitle: pageDataRaw?.seoTitle?.[lang] || pageDataRaw?.seoTitle?.en || "",
      seoDescription: pageDataRaw?.seoDescription?.[lang] || pageDataRaw?.seoDescription?.en || "",
      seoKeywords: pageDataRaw?.seoKeywords?.[lang] || pageDataRaw?.seoKeywords?.en || "",
      canonicalUrl: pageDataRaw?.canonicalUrl || null,
      robotsMeta: pageDataRaw?.robotsMeta || {},
      openGraph: pageDataRaw?.openGraph || {},
      twitterCard: pageDataRaw?.twitterCard || {},
      schemaOrg: pageDataRaw?.schemaOrg || {},
      additionalMetaTags: pageDataRaw?.additionalMetaTags || [],
    }

    console.log("Server-side: bodyText data:", pageData.bodyText)

    return {
      props: { globalData, pageData, preview, lang },
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return {
      props: { 
        pageData: {
          title: "",
          bodyText: null,
          description: "",
          modules: [],
          heroMediaType: "image",
          heroImage: null,
          heroSlider: [],
          heroVideo: null,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          canonicalUrl: null,
          robotsMeta: {},
          openGraph: {},
          twitterCard: {},
          schemaOrg: {},
          additionalMetaTags: [],
        },
        globalData: {
          colorsHeader: "#000000",
          colorsMain: "#000000",
        },
        preview: null,
        lang: params?.lang || "en",
        error: error.message,
      },
    }
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
    title,
    "slug": slug.current,
    "navTitle": title,
    "navSlug": slug.current,
    "navType": _type
  }
}`
