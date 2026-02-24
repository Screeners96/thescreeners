import { cmsClient, WrapperFields, RTE } from "@/utils/sanity"
import AboutUs from "@/components/pages/about-us/about-us"

const AboutUsPage = ({ pageData, globalData, preview, lang }) => {
  return <AboutUs pageData={pageData} globalData={globalData} preview={preview} lang={lang} />
}

export default AboutUsPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get the main about us page (or first one if multiple)
    const pageDataRaw = await cmsClient.fetch(`*[_type == "aboutUs"][0]{
      _id,
      _type,
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
      grids[] {
        ...,
        ${WrapperFields}
      },
      sectionsOrder[]-> {
        _id,
        _type,
        title {
          en,
          de
        },
        "slug": slug.current,
        sectionType,
        grids[] {
          ...,
          ${WrapperFields}
        },
        bodyText {
          en[] ${RTE},
          de[] ${RTE}
        },
        images[] {
          ...,
          asset->
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
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || [],
      description: pageDataRaw?.description?.[lang] || pageDataRaw?.description?.en || "",
      grids: pageDataRaw?.grids || [],
      sectionsOrder: (pageDataRaw?.sectionsOrder || []).map(section => ({
        ...section,
        title: section?.title?.[lang] || section?.title?.en || "",
        bodyText: section?.bodyText?.[lang] || section?.bodyText?.en || null,
        grids: section?.grids || [],
        images: section?.images || [],
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

