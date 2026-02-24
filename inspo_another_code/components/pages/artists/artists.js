import ImageCms from "@/components/utils/imageCms/imageCms"
import Intro from "@/components/intro/intro"
import Link from "next/link"

const ArtistsItem = ({ artist, lang = "en" }) => {

  const getLocalizedField = (field, lang, fallback = "") => {
    if (!field) return fallback
    if (typeof field === "object" && field !== null) {
      return field[lang] || field.en || field.de || fallback
    }
    return field || fallback
  }


  const title = getLocalizedField(artist?.title, lang)
  const subtitle = getLocalizedField(artist?.subtitle, lang)
  const description = getLocalizedField(artist?.description, lang)


  const link = `/${lang}/artists/${artist?.slug?.current}`

  return (
    <li>
      <Link className="artists__item" href={link} aria-label={`${title}`}>
        <div className="artists__item__info">
          <div className="artists__item__title">{title}</div>
          {subtitle && <div className="artists__item__subtitle">{subtitle}</div>}
        </div>
        <ImageCms image={artist?.teaserImage} />
      </Link>
    </li>
  )
}

const Artists = ({ pageData, lang = "en" }) => {
  return (
    <main className="main page--artists content" data-readable="true">
      {pageData?.bodyText?.length > 0 && <Intro data={pageData.bodyText} />}
      <section className="artists">
        <ul>
          {pageData?.artists
            ?.filter(Boolean) // Filter out any null/undefined artists
            ?.map((artist) => (
              <ArtistsItem artist={artist} lang={lang} key={artist._id} />
            ))}
        </ul>
      </section>
    </main>
  )
}

export default Artists
