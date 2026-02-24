import { cmsClient, ProjectModulesFields, RTE } from "@/utils/sanity"
import Page from "@/components/pages/page/page"

const TrailerSubpage = ({ pageData, globalData, preview, lang, category }) => {
  return <Page pageData={pageData} lang={lang} />
}

export default TrailerSubpage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"
    const category = params?.category || ""
    const slug = params?.slug || ""

    const globalDataRaw = (await cmsClient.fetch(globalQuery))[0] || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get trailer subpage
    const pageDataRaw = await cmsClient.fetch(`*[_type == "trailerSubpage" && slug.current == $slug && category->slug.current == $category][0]{
      _id,
      _type,
      title {
        en,
        de
      },
      category-> {
        _id,
        title {
          en,
          de
        },
        "slug": slug.current
      },
      teaserImage {
        ...,
        asset->
      },
      bodyText {
        en[] ${RTE},
        de[] ${RTE}
      },
      projectModules[] {
        ...,
        ${ProjectModulesFields}
      },
      "slug": slug.current
    }`, { slug, category })

    if (!pageDataRaw) {
      return { notFound: true }
    }

    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || null,
      projectModules: pageDataRaw?.projectModules || [],
      category: pageDataRaw?.category || null,
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
    const subpages = await cmsClient.fetch(`*[_type == "trailerSubpage" && defined(slug.current)]{
      "slug": slug.current,
      "categorySlug": category->slug.current
    }`)

    const paths = []
    subpages.forEach(subpage => {
      if (subpage.slug && subpage.categorySlug) {
        paths.push({ params: { lang: "en", category: subpage.categorySlug, slug: subpage.slug } })
        paths.push({ params: { lang: "de", category: subpage.categorySlug, slug: subpage.slug } })
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

