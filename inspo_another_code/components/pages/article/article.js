import Modules from "@/components/modules/modules"
import BodyText from "@/components/bodyText/bodyText"
import TeaserImage from "@/components/modules/moduleImage/moduleImage"
import RTE from "@/components/utils/rte/rte"
import Intro from "@/components/intro/intro"
import Link from "next/link"

const ArticlePage = ({ pageData, lang = "en" }) => {

  const subtitle =
    pageData?.subtitle && typeof pageData.subtitle === "object"
      ? pageData.subtitle[lang] || pageData.subtitle.en
      : pageData?.subtitle

    const isNewsArticle = (pageData) => {
      const { isArchived, moveToArchiveDate } = pageData

      if (isArchived === true) return false
      if (!moveToArchiveDate) return true

      return new Date(moveToArchiveDate) >= new Date()
    }


  let formattedPublishDate = null
  if (pageData?.publishingDate) {
    const dateObj = new Date(pageData.publishingDate)
    const options = { year: "numeric", month: "long", day: "numeric" }
    formattedPublishDate = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "de-DE", options)
  }

  let formattedArchiveDate = null
  if (pageData?.moveToArchiveDate) {
    const dateObj = new Date(pageData.moveToArchiveDate)
    const options = { year: "numeric", month: "long", day: "numeric" }
    formattedArchiveDate = dateObj.toLocaleDateString(lang === "en" ? "en-US" : "de-DE", options)
  }

  const bodyTextForLang = pageData?.bodyText?.[lang] || []
  const subtitleText = pageData?.subtitle?.[lang] || pageData?.subtitle?.en || "";

  return (
    <main className="main page--article content" data-readable="true">

      {isNewsArticle(pageData) && (
        <div className="back-button" style={{ marginBottom: "1rem" }}>
          <Link href={`/${lang}/news`} legacyBehavior>
            <a>&larr;</a>
          </Link>
        </div>
      )}


      {subtitleText && (
        <section className="intro" data-readable="true">
          {subtitleText}
        </section>
      )}

      <div className="article-header">
        {formattedPublishDate && (
          <div className="article-date">
            {formattedPublishDate}
          </div>
        )}
        {formattedArchiveDate && (
          <div className="article-archive-date">
            {formattedArchiveDate}
          </div>
        )}
      </div>

      {bodyTextForLang && <BodyText data={bodyTextForLang} />}


      {pageData?.teaserImage && (
        <>
          <TeaserImage 
            image={pageData.teaserImage} 
            alt={pageData.title?.[lang] || pageData.title?.en || pageData.title || ""}
          />
        </>
      )}

      {pageData?.modules?.length > 0 && (
        <div className="article-modules">
          <Modules modules={pageData.modules} lang={lang} />
        </div>
      )}
      
    </main>
  )
}

export default ArticlePage
