import Intro from "@/components/intro/intro";
import ModuleItemsList from "@/components/modules/moduleItemsList/moduleItemsList";

const PageLeichteSprache = ({ pageData }) => {
  if (!pageData) return null;

  return (
    <main className="main page--regular content leichte-sprache" data-readable="true">
      {pageData?.bodyText?.length > 0 && (
        <Intro data={pageData.bodyText} />
      )}

      {pageData?.items?.length > 0 && (
        <ModuleItemsList items={pageData.items} />
      )}
    </main>
  );
};

export default PageLeichteSprache;
