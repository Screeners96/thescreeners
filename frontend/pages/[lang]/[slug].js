import { cmsClient, GridFields, RTE } from "@/utils/sanity"
import Page from "@/components/pages/page/page"

const Slug = ({ pageData, globalData, lang }) => {
  const processedPageData = {
    ...pageData,
    title: pageData?.title?.[lang] || pageData?.title?.en || "",
    description: pageData?.description?.[lang] || pageData?.description?.en || "",
    bodyText: pageData?.bodyText?.[lang] || pageData?.bodyText?.en || [],
    grid: pageData?.grid || [],
  }

  return (
    <>
      <Page pageData={processedPageData} lang={lang} /> 
    </>
  )
}

export default Slug


export const getStaticProps = async ({ params, preview = null }) => {
  const lang = params?.lang || "en"


  if (!params?.slug) {
    return { notFound: true }
  }

  try {
    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    
    const pageData = await cmsClient.fetch(
      `*[_type == "page" && slug.current == $slug][0] {
        _id,
        _type,
        title {
          en,
          de
        },
        bodyText {
          en,
          de
        },
        grid[] {
          ...,
          ${GridFields}
        },
        description {
          en,
          de
        },
        "slug": slug.current
      }`,
      { slug: params.slug }
    )

    if (!pageData) {
      return { notFound: true }
    }

    return {
      props: { globalData, pageData, preview, lang },
    }
  } catch (error) {
    return { notFound: true }
  }
}

export const getStaticPaths = async () => {
  try {
    const slugs =
      (await cmsClient.fetch(`
        *[_type == "page" && defined(slug.current) && slug.current != null && slug.current != ""] {
          "slug": slug.current
        }
      `)) || []

    const validSlugs = slugs
      .map((entry) => entry?.slug)
      .filter((slug) => typeof slug === "string")

    const paths = validSlugs.flatMap((slug) => [
      { params: { lang: "en", slug } },
      { params: { lang: "de", slug } },
    ])

    return {
      paths,
      fallback: false,
    }
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    }
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
