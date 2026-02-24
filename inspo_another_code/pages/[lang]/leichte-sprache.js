import { cmsClient, ModulesFields } from "@/utils/sanity"; 
import PageLeichteSprache from "@/components/pages/leichte-sprache/leichte-sprache";


const LeichteSprache = ({ globalData, pageData, lang }) => {
  return <PageLeichteSprache pageData={pageData} lang={lang} />;
};

export default LeichteSprache;


export async function getStaticProps({ params, preview = null }) {
  const lang = params?.lang || 'en';

  const globalData = (await cmsClient.fetch(globalQuery))[0] || {};
  const pageDataRaw = (await cmsClient.fetch(pageQuery())) || {};


  const pageData = {
    ...pageDataRaw,
    bodyText: pageDataRaw.bodyText?.[lang] || [],
    title: pageDataRaw.title?.[lang] || '',
    items: pageDataRaw.items?.map((item) => ({
      itemTitle: item.itemTitle?.[lang] || '',
      itemBody: item.itemBody?.[lang] || [],
    })) || [],
  };


  return {
    props: { globalData, pageData, preview, lang },
    revalidate: 60, // Revalidate at most once per 60 seconds (ISR)
  };
}



export async function getStaticPaths() {
  return {
    paths: [
      { params: { lang: 'en' } },
      { params: { lang: 'de' } },
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

const pageQuery = () => `*[_type == "leichteSprache"][0] {
  title,
  bodyText,
  items[]{
    itemTitle,
    itemBody
  },
  description
}`;
