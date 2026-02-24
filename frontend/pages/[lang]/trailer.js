import { cmsClient, GridFields, RTE } from "@/utils/sanity"
import Trailer from "@/components/pages/trailer/trailer"

const TrailerPage = ({ pageData, globalData, preview, lang }) => {
  return <Trailer pageData={pageData} globalData={globalData} preview={preview} lang={lang} />
}

export default TrailerPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get the main trailer page (or first one if multiple)
    const pageDataRaw = await cmsClient.fetch(`*[_type == "trailer"][0]{
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
      categoriesOrder[]-> {
        _id,
        _type,
        title {
          en,
          de
        },
        "slug": slug.current,
        bodyText {
          en[] ${RTE},
          de[] ${RTE}
        },
        grid[] {
          ...,
          ${GridFields}
        }
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
      categoriesOrder: (pageDataRaw?.categoriesOrder || []).map(category => ({
        ...category,
        title: category?.title?.[lang] || category?.title?.en || "",
        bodyText: category?.bodyText?.[lang] || category?.bodyText?.en || [],
        grid: category?.grid || [],
      })),
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

