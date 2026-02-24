import { cmsClient } from "@/utils/sanity"
import Artist from "@/components/pages/artist/artist"

const PageArtist = ({ pageData, globalData, lang }) => {
  return <Artist pageData={pageData} lang={lang} />
}

export default PageArtist

export const getStaticProps = async ({ params, preview = null }) => {
  const lang = params?.lang || "en"

  if (!params?.handle) {
    return { notFound: true }
  }

  try {
    const globalData = (await cmsClient.fetch(globalQuery))[0] || {}

    const artist = await cmsClient.fetch(
      `*[_type == "artist" && slug.current == $handle][0] {
        _id,
        _type,
        title,
        subtitle,
        bodyText,
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
          text[] {
            ...,
            _type,
            children[] {
              ...,
              _type,
              text
            }
          },
          flag {
            en,
            de
          }
        },
        description
      }`,
      { handle: params.handle }
    )

    if (!artist) {
      return { notFound: true }
    }

    return {
      props: {
        globalData,
        pageData: artist,
        preview,
        lang,
      },
      revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
    }
  } catch (error) {
    return { notFound: true }
  }
}

export const getStaticPaths = async () => {
  
  return {
    paths: [],
    fallback: "blocking",
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