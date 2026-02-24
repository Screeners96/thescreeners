import { cmsClient, GridFields, RTE } from "@/utils/sanity"
import Imagefilm from "@/components/pages/imagefilm/imagefilm"

const ImagefilmPage = ({ pageData, globalData, preview, lang }) => {
  return <Imagefilm pageData={pageData} globalData={globalData} preview={preview} lang={lang} />
}

export default ImagefilmPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get the main imagefilm page (or first one if multiple)
    const pageDataRaw = await cmsClient.fetch(`*[_type == "imagefilm"][0]{
      _id,
      _type,
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
      },
      grid[] {
        ...,
        ${GridFields}
      },
      "slug": slug.current
    }`)

    if (!pageDataRaw) {
      return { notFound: true }
    }

    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      description: pageDataRaw?.description?.[lang] || pageDataRaw?.description?.en || "",
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || [],
      grid: pageDataRaw?.grid || [],
    }

    return {
      props: { globalData, pageData, preview, lang },
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
    title,
    "slug": slug.current,
    "navTitle": title,
    "navSlug": slug.current,
    "navType": _type
  }
}`

