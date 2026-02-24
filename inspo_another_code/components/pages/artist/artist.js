import Modules from "@/components/modules/modules"

const Artist = ({ pageData, lang = "en" }) => {
  return (
    <main className="main page--artist content" data-readable="true">
      <Modules modules={pageData?.modules || []} lang={lang} />
    </main>
  )
}

export default Artist
