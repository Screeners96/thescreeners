import { cmsClient, ProjectModulesFields, RTE } from "@/utils/sanity"
import Page from "@/components/pages/page/page"

const EventSubpage = ({ pageData, globalData, preview, lang }) => {
  return <Page pageData={pageData} lang={lang} />
}

export default EventSubpage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"
    const slug = params?.slug || ""

    const globalDataRaw = (await cmsClient.fetch(globalQuery))[0] || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    // Get event subpage
    const pageDataRaw = await cmsClient.fetch(`*[_type == "eventSubpage" && slug.current == $slug][0]{
      _id,
      _type,
      title {
        en,
        de
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
    }`, { slug })

    if (!pageDataRaw) {
      return { notFound: true }
    }

    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title?.[lang] || pageDataRaw?.title?.en || "",
      bodyText: pageDataRaw?.bodyText?.[lang] || pageDataRaw?.bodyText?.en || null,
      projectModules: pageDataRaw?.projectModules || [],
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
  try {
    const subpages = await cmsClient.fetch(`*[_type == "eventSubpage" && defined(slug.current)]{
      "slug": slug.current
    }`)

    const paths = []
    subpages.forEach(subpage => {
      if (subpage.slug) {
        paths.push({ params: { lang: "en", slug: subpage.slug } })
        paths.push({ params: { lang: "de", slug: subpage.slug } })
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

