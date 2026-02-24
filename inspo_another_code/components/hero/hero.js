"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import dynamic from "next/dynamic";
import ImageCms from "../utils/imageCms/imageCms";

const ArtistSlideshow = dynamic(() => import("../artistSlideshow/artistSlideshow"), { ssr: false });

const Hero = ({ image, text, credits, ticker, artistData = [], lang = "en" }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [showText, setShowText] = useState(true);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const creditsText = credits ? (typeof credits === "object" ? credits[lang] || credits.en || "" : credits) : "";

  useEffect(() => {
    setBaseUrl(window.location.origin);

    const timer = setTimeout(() => {
      setShowText(false);
    }, 8000);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY > vh && !hasScrolledPast) {
        setHasScrolledPast(true);
      }

      if (scrollY <= 10 && hasScrolledPast) {
        setShowText(true);
        setHasScrolledPast(false);

        setTimeout(() => {
          setShowText(false);
        }, 8000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolledPast]);


  return (
    <section className="hero">
      <div className="hero__visual">
        {artistData && artistData.length > 0 ? (
          <ArtistSlideshow artistData={artistData} lang={lang} />
        ) : image ? (
          <ImageCms image={image} /> 
        ) : (
          <div style={{ background: "#f0f0f0", height: "300px" }}></div>
        )}

        {text && (
          <div
            className="hero__visual__text"
            style={{ opacity: showText ? 1 : 0, transition: 'opacity 0.5s ease' }}
          >
            <span>{text}</span>
            {creditsText && <small>{creditsText}</small>}
          </div>
        )}

      </div>

      {ticker && (
        <Link 
          data-skip-read="true"
          href={baseUrl ? `${baseUrl}/${lang}/news` : `/${lang}/news`}
          aria-label={lang === "de" ? "Zu den Nachrichten" : "Go to news"}
        >
          <Marquee className="hero__ticker" data-skip-read="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} className="child">
                {ticker}
              </span>
            ))}
          </Marquee>
        </Link>
      )}
    </section>
  );
};

export default Hero;

