import { cmsClient } from "@/utils/sanity";
import Artists from "@/components/pages/artists/artists";

const PageArtists = ({ pageData, globalData, lang }) => {
  return <Artists pageData={pageData} lang={lang} />;
};

export default PageArtists;

export async function getStaticProps({ params, preview = null }) {
  const lang = params?.lang || "en";

  const globalData = (await cmsClient.fetch(globalQuery))[0] || {};
  const pageDataRaw = (await cmsClient.fetch(queryArtists())) || {};

  const pageData = {
    title: (typeof pageDataRaw.title === "object"
      ? pageDataRaw.title?.[lang] || pageDataRaw.title?.en
      : pageDataRaw.title) || "", 
    bodyText: typeof pageDataRaw.bodyText === "object"
      ? pageDataRaw.bodyText?.[lang] || []
      : [],
    artists: pageDataRaw.artists || [],
  };

  return {
    props: { globalData, pageData, preview, lang },
    revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
  };
}


export async function getStaticPaths() {
  return {
    paths: [
      { params: { lang: "en" } },
      { params: { lang: "de" } },
    ],
    fallback: false,
  };
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
}`;

const queryArtists = () => `
  *[_type == "artists"][0] {
    title,
    bodyText,
    artists[]->{
      title,
      slug,
      teaserImage,
      subtitle
    },
    description
  }
`;
