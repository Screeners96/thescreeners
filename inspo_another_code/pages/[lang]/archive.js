import { cmsClient } from "@/utils/sanity"
import TabsArchive from "@/components/pages/tabsArchive/tabsArchive"

const PageArchive = ({ pageData, globalData, preview, lang }) => {

  return <TabsArchive pageData={pageData} filtering={true} lang={lang} />
}

export default PageArchive

export async function getStaticProps({ params, preview = null }) {
  const lang = params?.lang || "en"

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}

    const pageDataRaw = (await cmsClient.fetch(pageQuery())) || {}

    const articlesRaw = await cmsClient.fetch(articlesQuery())


    const seenIds = new Set()
    const articles = articlesRaw.filter((article) => {
      if (!article._id) return false
      if (seenIds.has(article._id)) return false
      seenIds.add(article._id)
      return true
    })


    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title
        ? typeof pageDataRaw.title === "object"
          ? pageDataRaw.title?.[lang] || pageDataRaw.title?.en || ""
          : pageDataRaw.title
        : "",
      subtitle: pageDataRaw?.subtitle
        ? typeof pageDataRaw.subtitle === "object"
          ? pageDataRaw.subtitle?.[lang] || pageDataRaw.subtitle?.en || ""
          : pageDataRaw.subtitle
        : "",
      bodyText: pageDataRaw?.bodyText
        ? typeof pageDataRaw.bodyText === "object"
          ? pageDataRaw.bodyText?.[lang] || pageDataRaw.bodyText?.en || []
          : pageDataRaw.bodyText
        : [],

      modules: (pageDataRaw?.modules || []).map((module) => {
      

        return {
          ...module,
          title: module.title?.[lang] || module.title?.en || "",
          subtitle: module.subtitle?.[lang] || module.subtitle?.en || "",
          bodyText: module.bodyText?.[lang] || module.bodyText?.en || [],
          flagTitle: module.flagTitle?.[lang] || module.flagTitle?.en || "",
          text: module.text || module.bodyText || {},
          flag: module.flag || {},
        }
      }),

      items: articles.map((article) => {

        let categories
        if (article.categories) {
          if (typeof article.categories === "string") {
         
            categories = article.categories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          } else if (typeof article.categories === "object" && !Array.isArray(article.categories)) {
          
            categories = article.categories
          } else if (Array.isArray(article.categories)) {
 
            categories = article.categories
          }
        } else {
          categories = []
        }

        return {
          ...article,
          _id: article._id || `article-${Math.random().toString(36).substr(2, 9)}`,

          title: article.title || {},
     
          subtitle: article.subtitle
            ? typeof article.subtitle === "object"
              ? article.subtitle?.[lang] || article.subtitle?.en || ""
              : article.subtitle
            : "",
    
          bodyText: article.bodyText
            ? typeof article.bodyText === "object"
              ? article.bodyText?.[lang] || article.bodyText?.en || []
              : article.bodyText
            : [],

          categories: categories,

          modules: (article.modules || []).map((module) => {
            return {
              ...module,
              title: module.title?.[lang] || module.title?.en || "",
              subtitle: module.subtitle?.[lang] || module.subtitle?.en || "",
              bodyText: module.bodyText?.[lang] || module.bodyText?.en || [],
              flagTitle: module.flagTitle?.[lang] || module.flagTitle?.en || "",
              text: module.text || module.bodyText || {},
              flag: module.flag || {},
            }
          }),
        }
      }),
    }

    return {
      props: { globalData, pageData, preview, lang },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {

    return {
      props: {
        globalData: {},
        pageData: {
          title: lang === "en" ? "Archive" : "Archiv",
          subtitle: "",
          bodyText: [],
          modules: [],
          items: [],
        },
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

const pageQuery = () => `
  *[_type == "archive"][0] {
    _id,
    title,
    subtitle,
    bodyText,
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
      flagTitle {
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
      flagTitle,
      height,
      link->,
      linkExt,
      logos[] {
        ...,
        "filename": asset->originalFilename
      },
      slides[] {
        ...,
        _key,
        title {
          en,
          de
        },
        imageDesktop,
        "filename": imageDesktop.asset->originalFilename
      }
    }
  }
`

const articlesQuery = () => `
  *[_type == "article" && (
    isArchived == true || 
    (defined(moveToArchiveDate) && moveToArchiveDate < now())
  )] | order(publishingDate desc) {
    _id,
    title,
    subtitle,
    bodyText,
    publishingDate,
    moveToArchiveDate,
    teaserImage,
    categories,
    slug,
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
      flagTitle {
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
      flagTitle,
      height,
      link->,
      linkExt,
      logos[] {
        ...,
        "filename": asset->originalFilename
      },
      slides[] {
        ...,
        _key,
        title {
          en,
          de
        },
        imageDesktop,
        "filename": imageDesktop.asset->originalFilename
      }
    },
    description
  }
`
