import BodyText from "@/components/bodyText/bodyText"
import TeaserImage from "@/components/modules/moduleImage/moduleImage"
import Modules from "@/components/modules/modules"

const Page = ({ pageData, lang = "en" }) => {
  const bodyTextForLang = pageData?.bodyText?.[lang] || []
  const subtitleText = pageData?.subtitle?.[lang] || pageData?.subtitle?.en || ""

  return (
    <main className="main page--regular content" data-readable="true">
      {subtitleText && (
        <section className="intro" data-readable="true">
          {subtitleText}
        </section>
      )}

      {bodyTextForLang && <BodyText data={bodyTextForLang} />}

      {pageData?.teaserImage && (
        <TeaserImage
          image={pageData.teaserImage}
          alt={pageData.title?.[lang] || pageData.title?.en || pageData.title || ""}
        />
      )}

      {pageData?.modules?.length > 0 && <Modules modules={pageData.modules} lang={lang} />}
    </main>
  )
}

export default Page
