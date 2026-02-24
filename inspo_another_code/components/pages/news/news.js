import Intro from "@/components/intro/intro"
import BodyText from "@/components/bodyText/bodyText"
import Link from "next/link"

const createArticleLink = (lang, slug) => {
  return `/${lang}/articles/${slug}`
}

const NewsItem = ({ article, lang }) => {
  const dateData = new Date(article?.publishingDate)
  const options = { month: "2-digit", day: "numeric", year: "2-digit" }
  const formattedDate = dateData.toLocaleDateString("de-DE", options)

  const link = createArticleLink(lang, article?.slug?.current)

  return (
    <li className="news__item">
      <Link href={link} aria-label={`${article?.title}, ${formattedDate}`}>
        <div className="news__item__date">{formattedDate}</div>
        <div className="news__item__title">
          {typeof article?.title === "object" ? article?.title?.[lang] || article?.title?.en : article?.title}
        </div>
      </Link>
    </li>
  )
}

const News = ({ pageData, lang = "en" }) => {
  return (
    <main className="main page--news content" data-readable="true">

      {pageData?.bodyText?.[lang]?.length > 0 && <Intro data={pageData.bodyText[lang]} />}


      <section className="news">
        <ul>
          {pageData?.articles?.map((article, index) => (
            <NewsItem article={article} lang={lang} key={article._id || `article-${index}`} />
          ))}
        </ul>

        {(!pageData?.articles || pageData.articles.length === 0) && (
          <div className="news__empty">
            <p>{lang === "en" ? "No news articles available." : "Keine Nachrichtenartikel verfügbar."}</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default News
