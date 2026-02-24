import { cmsClient, ModulesFields } from "@/utils/sanity"
import Frontpage from "@/components/pages/frontpage/frontpage"

const PageFront = ({ pageData, globalData, artistData, preview, lang }) => {
  return <Frontpage pageData={pageData} globalData={globalData} artistData={artistData} lang={lang} />
}

export default PageFront

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = (await cmsClient.fetch(globalQuery))[0] || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    const pageDataRaw = await cmsClient.fetch(`*[_type == "frontpage"][0]{
      title,
      "heroText": heroText,
      heroTextCredits,
      "heroTicker": heroTicker,
      heroImage,
      bodyText,
      description,
      modules[] {
        ...,
        ${ModulesFields}
      }
    }`)

    const artistData = await cmsClient.fetch(`*[_type == "artist" && defined(teaserImage)][]{
      _id,
      title,
      subtitle,
      subtitle {
        en,
        de
      },
      slug,
      "image": teaserImage,
      "ref": teaserImage.asset._ref
    }`)

    const seen = new Set()
    const uniqueArtistData = artistData.filter((item) => {
      if (!item || !item.ref) return false
      if (seen.has(item.ref)) return false
      seen.add(item.ref)
      return true
    })

    // Process the multilingual bodyText
    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      heroText: pageDataRaw?.heroText?.[lang] || pageDataRaw?.heroText?.en || "",
      heroTicker: pageDataRaw?.heroTicker?.[lang] || pageDataRaw?.heroTicker?.en || "",
      heroTextCredits: pageDataRaw?.heroTextCredits?.[lang] || pageDataRaw?.heroTextCredits?.en || "",
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || null,
      modules: pageDataRaw?.modules || [],
      heroImage: pageDataRaw?.heroImage || null,
    }

    console.log("Server-side: bodyText data:", pageData.bodyText)

    return {
      props: { globalData, pageData, artistData: uniqueArtistData, preview, lang },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return {
      props: { 
        pageData: {
          title: "",
          heroText: "",
          heroTicker: "",
          heroTextCredits: "",
          bodyText: null,
          modules: [],
          heroImage: null,
        },
        globalData: {
          colorsHeader: "#000000",
          colorsMain: "#000000",
        },
        artistData: [],
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

const globalQuery = `*[_type == "settings"] {
  ...,
  footerRight,
  footerInfo,
  footerLink->,
  nav[]->{
    _id,
    _type,
    title,
    slug,
    "navTitle": title,
    "navSlug": slug.current
  },
  "impressumTitle": *[_type == "page" && slug.current == "impressum"][0].title
}`
