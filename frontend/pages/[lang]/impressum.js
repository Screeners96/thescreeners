import { cmsClient, RTE, globalQuery } from "@/utils/sanity"
import ImpressumDatenschutz from "@/components/pages/impressum-datenschutz/impressum-datenschutz"

const ImpressumPage = ({ impressumData, datenschutzData, globalData, preview, lang }) => {
  return (
    <ImpressumDatenschutz 
      impressumData={impressumData} 
      datenschutzData={datenschutzData} 
      lang={lang} 
    />
  )
}

export default ImpressumPage

export async function getStaticProps({ params, preview = null }) {
  try {
    const lang = params?.lang || "en"

    const globalDataRaw = await cmsClient.fetch(globalQuery) || {}
    const globalData = {
      ...globalDataRaw,
      colorsHeader: globalDataRaw.colorsHeader || "#000000",
      colorsMain: globalDataRaw.colorsMain || "#000000",
    }

    const impressumDataRaw = await cmsClient.fetch(`*[_type == "impressum"][0]{
      _id,
      _type,
      title {
        en,
        de
      },
      subtitle {
        en[] ${RTE},
        de[] ${RTE}
      },
      bodyText {
        en[] ${RTE},
        de[] ${RTE}
      },
      description {
        en,
        de
      },
      "slug": slug.current
    }`)

    const datenschutzDataRaw = await cmsClient.fetch(`*[_type == "datenschutz"][0]{
      _id,
      _type,
      title {
        en,
        de
      },
      subtitle {
        en[] ${RTE},
        de[] ${RTE}
      },
      bodyText {
        en[] ${RTE},
        de[] ${RTE}
      },
      description {
        en,
        de
      },
      "slug": slug.current
    }`)

    const impressumData = impressumDataRaw ? {
      ...impressumDataRaw,
      title: impressumDataRaw?.title?.[lang] || impressumDataRaw?.title?.en || "",
      subtitle: impressumDataRaw?.subtitle?.[lang] || impressumDataRaw?.subtitle?.en || [],
      description: impressumDataRaw?.description?.[lang] || impressumDataRaw?.description?.en || "",
      bodyText: impressumDataRaw?.bodyText?.[lang] || impressumDataRaw?.bodyText?.en || [],
    } : null

    const datenschutzData = datenschutzDataRaw ? {
      ...datenschutzDataRaw,
      title: datenschutzDataRaw?.title?.[lang] || datenschutzDataRaw?.title?.en || "",
      subtitle: datenschutzDataRaw?.subtitle?.[lang] || datenschutzDataRaw?.subtitle?.en || [],
      description: datenschutzDataRaw?.description?.[lang] || datenschutzDataRaw?.description?.en || "",
      bodyText: datenschutzDataRaw?.bodyText?.[lang] || datenschutzDataRaw?.bodyText?.en || [],
    } : null

    const pageData = {
      title: impressumData?.title || datenschutzData?.title || (lang === "de" ? "Impressum & Datenschutz" : "Imprint & Privacy Policy"),
      description: impressumData?.description || datenschutzData?.description || "",
    }

    return {
      props: { 
        globalData, 
        pageData,
        impressumData, 
        datenschutzData, 
        preview, 
        lang 
      },
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    return { notFound: true }
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { lang: "en" } }, { params: { lang: "de" } }],
    fallback: false,
  }
}

