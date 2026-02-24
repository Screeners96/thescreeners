import { cmsClient } from "@/utils/sanity"
import Tabs from "@/components/pages/tabs/tabs"

const PageNetzwerke = ({ pageData, globalData, preview, lang }) => {
  return <Tabs pageData={pageData} itemsName="netzwerke" filtering={true} lang={lang} sortAlphabetically={true} />
}
 
export default PageNetzwerke

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

      items: (pageDataRaw?.netzwerke || []).map((item) => {
        

        return {
          ...item,
          _id: item._id || `netzwerk-${Math.random().toString(36).substr(2, 9)}`,
          
          title: item.title || {},

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
  
          categories: (() => {
            if (!item.categories) return []

            if (
              typeof item.categories === "object" &&
              !Array.isArray(item.categories) &&
              (item.categories.en || item.categories.de)
            ) {

              return item.categories
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
          })(),

          modules: (item.modules || []).map((module) => {
        
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
          title: "Netzwerke",
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
  *[_type == "netzwerke"][0] {
    _id,
    title,
    subtitle,
    bodyText,
    categories,
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
    netzwerke[]-> {
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
      categories,
      slug,
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
  }
`
