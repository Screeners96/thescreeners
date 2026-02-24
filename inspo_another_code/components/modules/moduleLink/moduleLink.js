import Link from "next/link"

const ModuleLink = ({ module, lang = "en", index }) => {
  if (!module) {
    return null
  }

  const slug = module?.link?.slug?.current
  const url = module?.linkExt

  let title = ""
  if (module.title) {
    if (typeof module.title === "object" && module.title !== null) {
      title = module.title[lang] || module.title.en || ""
    } else {
      title = module.title
    }
  }

  if (!title) {
    title = slug ? `Link to ${slug}` : url || "Link"
  }


  const isGenericTitle = ["Link", "Read More", "Learn More", "Click Here"].includes(title)
  const contextualTitle = isGenericTitle && slug ? `${title} - ${slug}` : title

  const linkText = lang === "de" ? "Mehr über" : "More about";
  const ariaLabel = `${linkText} ${contextualTitle}${index !== undefined ? `` : ""}`;

  return (
    <section className="moduleLink rte module">
      {slug ? (
        <Link href={`/${lang}/${slug}`} className="moduleLink__button" aria-label={ariaLabel}>
          {contextualTitle}
        </Link>
        
      ) : (
        <a
          href={url}
          className="moduleLink__button"
          data-readable="true"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ariaLabel} (opens in new tab)`}
        >
          {contextualTitle}
        </a>
      )}
    </section>
  )
}

export default ModuleLink
