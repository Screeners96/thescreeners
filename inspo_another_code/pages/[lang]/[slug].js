import { cmsClient } from "@/utils/sanity"
import Page from "@/components/pages/page/page"

const Slug = ({ pageData, lang }) => {
  const bodyTextForLang = pageData?.bodyText?.[lang] || []

  return (
    <>
      <Page pageData={pageData} lang={lang} /> 
    </>
  )
}

export default Slug


export const getStaticProps = async ({ params, preview = null }) => {
  const lang = params?.lang || "en"


  if (!params?.slug) {
    return { notFound: true }
  }

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}

    
    const pageData = await cmsClient.fetch(
      `*[_type == "page" && slug.current == $slug][0] {
        _id,
        _type,
        title,
        subtitle,
        subtitle {
          en,
          de
        },
        description,
        bodyText {
          en,
          de
        },
        teaserImage,
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
        }
      }`,
      { slug: params.slug }
    )

    if (!pageData) {
      return { notFound: true }
    }

    return {
      props: { globalData, pageData, preview, lang },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {
    return { notFound: true }
  }
}

export const getStaticPaths = async () => {
  try {
    const slugs =
      (await cmsClient.fetch(`
        *[_type == "page" && defined(slug.current) && slug.current != null && slug.current != ""] {
          "slug": slug.current
        }
      `)) || []

    const validSlugs = slugs
      .map((entry) => entry?.slug)
      .filter((slug) => typeof slug === "string")

    const paths = validSlugs.flatMap((slug) => [
      { params: { lang: "en", slug } },
      { params: { lang: "de", slug } },
    ])

    return {
      paths,
      fallback: false,
    }
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    }
  }
}


const globalQuery = `*[_id == "settings"] {
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
