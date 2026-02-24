import { cmsClient } from "@/utils/sanity"
import ArticlePage from "@/components/pages/article/article"

const PageArticle = ({ pageData, globalData, lang }) => {
  return <ArticlePage pageData={pageData} lang={lang} />
}

export default PageArticle

export const getStaticProps = async ({ params, preview = null }) => {
  const lang = params?.lang || "en"

  if (!params?.slug) {
    return { notFound: true }
  }

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}

    const article = await cmsClient.fetch(
      `*[_type == "article" && slug.current == $slug][0] {
        _id,
        _type,
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
        publishingDate,
        moveToArchiveDate,
        "hasModules": defined(modules),
        "moduleCount": count(modules),
        modules[] {
          ...,
          _type,
          _key,
          title {
            en,
            de
          },
          subtitle {
            en,
            de
          },
          bodyText {
            en,
            de
          },
          text[] {
            ...,
            _type,
            children[] {
              ...,
              _type,
              text
            }
          },
          flag {
            en,
            de
          }
        },
        description
      }`,
      { slug: params.slug }
    )

    if (!article) {
      return { notFound: true }
    }

    if (!article.moveToArchiveDate) {
      article.moveToArchiveDate = null
    }

    return {
      props: {
        globalData,
        pageData: article,
        preview,
        lang,
      },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {
    return { notFound: true }
  }
}

export const getStaticPaths = async () => {
  try {

    const articles = await cmsClient.fetch(`
   *[_type == "article" && defined(slug.current) && slug.current != null && slug.current != ""] {
        _id,
        "slug": slug.current
      }
    `)

    if (!Array.isArray(articles)) {
      return {
        paths: [],
        fallback: "blocking",
      }
    }

    const validArticles = articles.filter(
      (article) => article && article.slug && typeof article.slug === "string"
    )

    const uniqueSlugs = [...new Set(validArticles.map((article) => article.slug))]

    const paths = uniqueSlugs.flatMap((slug) => [
      { params: { lang: "en", slug } },
      { params: { lang: "de", slug } },
    ])

    return {
      paths,
      fallback: "blocking",
    }
  } catch (error) {

    return {
      paths: [],
      fallback: "blocking",
    }
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
