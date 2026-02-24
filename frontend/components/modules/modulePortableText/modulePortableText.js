import RTE from "../../utils/rte/rte"
  
export default function ModulePortableText({ content, locale = 'en' }) {
  if (!content) return null;
  
  return (
    <div className="portable-text" data-readable="true">
      <RTE text={content} lang={locale} />
    </div>
  );
}