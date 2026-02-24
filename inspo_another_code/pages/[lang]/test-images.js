import { useEffect, useState } from "react";
import { cmsClient } from "@/utils/sanity";
import ImageCms from "@/components/utils/imageCms/imageCms";

const TestImages = ({ images }) => {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  const [orderedImages] = useState(shuffled);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!orderedImages.length) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % orderedImages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderedImages]);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Artist Slideshow</h1>
      <div style={{ width: "80%", margin: "2rem auto", position: "relative", aspectRatio: "3 / 2" }}>
          <div className="hero__visual">
          {orderedImages.map((img, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: index === current ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                objectFit: "cover",
              }}
            >
              <ImageCms image={img} className="hero__image" />
            </div>
          ))}
        </div>
        
      </div>
    </main>
  );
};

export default TestImages;

export async function getStaticProps({ params }) {
    const globalDataRaw = await cmsClient.fetch(`*[_type == "settings"][0]`);
    const globalData = {
      ...globalDataRaw,
      nav: (globalDataRaw.nav || []).map(item => ({
        ...item,
        slug: item.slug || { current: "" },
      }))
    };
  
    const result = await cmsClient.fetch(`*[_type == "artist" && defined(teaserImage)][]{
      "image": teaserImage,
      "ref": teaserImage.asset._ref
    }`);
  
    const seen = new Set();
    const images = result
      .filter(item => {
        if (seen.has(item.ref)) return false;
        seen.add(item.ref);
        return true;
      })
      .map(item => item.image);
  
    return {
      props: { images, globalData },
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


