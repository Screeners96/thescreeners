import RTE from "../utils/rte/rte";

const Intro = ({ data, title, lang = "en" }) => {
  if ((!data || data.length === 0) && !title) return null;

  return (
    <section className="intro" data-readable="true">
      {title && <h1 className="intro__title">{title}</h1>}
      <span>
      {data && data.length > 0 && <RTE text={data} lang={lang} />}</span>
    </section>
  );
};

export default Intro;
