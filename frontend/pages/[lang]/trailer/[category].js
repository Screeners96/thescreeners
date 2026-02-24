import { cmsClient, GridFields } from "@/utils/sanity"
import Page from "@/components/pages/page/page"

const TrailerCategoryPage = ({ pageData, globalData, preview, lang, category }) => {
  return <Page pageData={pageData} lang={lang} />
}

export default TrailerCategoryPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"
    const category = params?.category || ""

    const globalDataRaw = (await cmsClient.fetch(globalQuery))[0] || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get trailer category page
    const pageDataRaw = await cmsClient.fetch(`*[_type == "trailerCategory" && slug.current == $category][0]{
      _id,
      _type,
      title {
        en,
        de
      },
      "slug": slug.current,
      grid[] {
        ...,
        ${GridFields}
      }
    }`, { category })

    if (!pageDataRaw) {
      return { notFound: true }
    }

    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      grid: pageDataRaw?.grid || [],
    }

    return {
      props: { globalData, pageData, preview, lang, category },
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  try {
    const categories = await cmsClient.fetch(`*[_type == "trailerCategory" && defined(slug.current)]{
      "slug": slug.current
    }`)

    const paths = []
    categories.forEach(category => {
      if (category.slug) {
        paths.push({ params: { lang: "en", category: category.slug } })
        paths.push({ params: { lang: "de", category: category.slug } })
      }
    })

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

const globalQuery = `*[_type == "settings"] {
  ...,
  colorsAccent,
  colorLightGrey,
  colorGrey,
  colorDarkGrey,
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
  }
}`

