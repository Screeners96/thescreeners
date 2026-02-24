import { cmsClient } from "@/utils/sanity"
import Tabs from "@/components/pages/tabs/tabs"

const PageBesserePraktiken = ({ pageData, globalData, preview, lang }) => {

  return <Tabs pageData={pageData} filtering={false} lang={lang} />
}

export default PageBesserePraktiken

export async function getStaticProps({ params, preview = null }) {
  const lang = params?.lang || "en"

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}
    const pageDataRaw = (await cmsClient.fetch(pageQuery())) || {}

 
    const pageData = {
      ...pageDataRaw,
      title: pageDataRaw?.title
        ? typeof pageDataRaw.title === "object"
          ? pageDataRaw.title?.[lang] || pageDataRaw.title?.en || ""
          : pageDataRaw.title
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
          flag: module.flag?.[lang] || module.flag?.en || "",
        }
      }),

      items: (pageDataRaw?.besserePraktiken || []).map((item) => {
    

        const processCategories = () => {
          if (!item.categories) return []


          if (typeof item.categories === "object" && !Array.isArray(item.categories)) {
            return item.categories[lang] || item.categories.en || []
          }

          else if (typeof item.categories === "string") {
            return item.categories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          }

          else if (Array.isArray(item.categories)) {
            return item.categories
          }

          return []
        }

        return {
          ...item,
          _id: item._id || `besserePraxis-${Math.random().toString(36).substr(2, 9)}`,

          title: typeof item.title === "object" ? item.title?.[lang] || item.title?.en || "" : item.title || "",

          subtitle: item.subtitle
            ? typeof item.subtitle === "object"
              ? item.subtitle?.[lang] || item.subtitle?.en || ""
              : item.subtitle
            : "",

          bodyText: item.bodyText
            ? typeof item.bodyText === "object"
              ? item.bodyText?.[lang] || item.bodyText?.en || []
              : item.bodyText
            : [],

          categories: processCategories(),

          modules: (item.modules || []).map((module) => {
            

            return {
              ...module,
              title: module.title?.[lang] || module.title?.en || "",
              subtitle: module.subtitle?.[lang] || module.subtitle?.en || "",
              bodyText: module.bodyText?.[lang] || module.bodyText?.en || [],
              flagTitle: module.flagTitle?.[lang] || module.flagTitle?.en || "",
              text: module.text || module.bodyText || {},
              flag: module.flag?.[lang] || module.flag?.en || "",
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
          title: "BesserePraktiken",
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
*[_type == "besserePraktiken"][0] {
  _id,
  title,
  subtitle {
      en,
      de
    },
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
  },
  description,
  besserePraktiken[]-> {
    _id,
    title,
    slug,
    categories,
    teaserImage,
    subtitle {
      en,
      de
    },
    bodyText {
      en,
      de
    },
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
      },
      flag {
        en,
        de
      }
    },
    description
  }
}
`
