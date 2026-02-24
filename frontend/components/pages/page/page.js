import Intro from "@/components/intro/intro"
import TeaserImage from "@/components/modules/moduleImage/moduleImage"
import Modules from "@/components/modules/modules"

const Page = ({ pageData, lang = "en" }) => {
  const bodyTextForLang = pageData?.bodyText || []
  const subtitleData = pageData?.subtitle || []

  return (
    <>
      <main id="main-content" className="main page--regular content" data-readable="true" role="main">
      {(pageData?.title || (bodyTextForLang && bodyTextForLang.length > 0)) && (
        <Intro title={pageData?.title} data={bodyTextForLang} lang={lang} />
      )}

      {subtitleData && subtitleData.length > 0 && (
        <Intro data={subtitleData} lang={lang} />
      )}

      {pageData?.teaserImage && (
        <TeaserImage
          image={pageData.teaserImage}
          alt={pageData.title || ""}
        />
      )}

      {pageData?.modules?.length > 0 && <Modules modules={pageData.modules} lang={lang} />}
      </main>
    </>
  )
}

export default Page
