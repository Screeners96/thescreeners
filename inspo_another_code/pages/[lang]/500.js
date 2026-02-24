import { cmsClient, ModulesFields } from "../../utils/sanity"
import Frontpage from "../../components/pages/frontpage/frontpage"

const Custom500 = ({ pageData, lang }) => {
  // Process the pageData to avoid rendering objects directly
  const processedPageData = {
    ...pageData,
    title: typeof pageData?.title === 'object' ? pageData.title[lang] || pageData.title.en : pageData.title,
    heroText: typeof pageData?.heroText === 'object' ? pageData.heroText[lang] || pageData.heroText.en : pageData.heroText,
    heroTicker: typeof pageData?.heroTicker === 'object' ? pageData.heroTicker[lang] || pageData.heroTicker.en : pageData.heroTicker,
    modules: pageData?.modules || []
  }
  
  return <Frontpage pageData={processedPageData} lang={lang} />
}

export default Custom500

export async function getStaticProps({ params }) {
  const lang = params?.lang || "en"
  const globalData = (await cmsClient.fetch(globalQuery))[0] || {}
  const pageData = (await cmsClient.fetch(pageQuery()))[0] || {}
  
  return {
    props: { 
      globalData, 
      pageData, 
      preview: null,
      lang
    },
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

const pageQuery = () => {
  return `*[_type == "frontpage"] {
    ...,
    modules[] {
      ...,
      ${ModulesFields}
    }
  }`
}