import { cmsClient } from "@/utils/sanity"
import News from "@/components/pages/news/news"

const PageNews = ({ pageData, globalData, lang }) => {
  return <News pageData={pageData} lang={lang} />
}

export default PageNews

export async function getStaticProps({ params, preview = null }) {
  const lang = params?.lang || "en"

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}
    const pageData = (await cmsClient.fetch(queryNews())) || {}

    const articles = await cmsClient.fetch(`
      *[_type == "article" && defined(slug.current) && (
        isArchived != true && 
        (!defined(moveToArchiveDate) || moveToArchiveDate >= now())
      )] | order(publishingDate desc) {
        _id,
        title,
        subtitle {
          en,
          de
        },
        bodyText {
          en,
          de
        },
        teaserImage,
        slug,
        publishingDate,
        moveToArchiveDate,
        description
      }
    `)



    pageData.articles = articles

    return {
      props: { globalData, pageData, preview, lang },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {

    return {
      props: {
        globalData: {},
        pageData: { title: "News", bodyText: {}, articles: [] },
        preview,
        lang,
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

const queryNews = () => `*[_type == "news"][0] {
  title,
  bodyText,
}`
