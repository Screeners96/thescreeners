"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import dynamic from "next/dynamic";
import HeroImage from "../utils/heroImage/heroImage";
import HeroSlider from "../utils/heroSlider/heroSlider";
import HeroVideo from "../utils/heroVideo/heroVideo";

const Slideshow = dynamic(() => import("../slideshow/slideshow"), { ssr: false });

const Hero = ({ 
  image, 
  text, 
  credits, 
  ticker, 
  slideshowData = [], 
  lang = "en",
  heroMediaType = "image",
  heroImage = null,
  heroSlider = [],
  heroVideo = null
}) => {
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

  const renderHeroMedia = () => {
    if (heroMediaType === "video" && heroVideo) {
      return <HeroVideo video={heroVideo} lang={lang} />
    }
    
    if (heroMediaType === "slider" && heroSlider && heroSlider.length > 0) {
      return <HeroSlider images={heroSlider} lang={lang} />
    }
    
    if (heroMediaType === "image" && heroImage) {
      return <HeroImage image={heroImage} lang={lang} className="hero__image" />
    }
    
    if (slideshowData && slideshowData.length > 0) {
      return <Slideshow slideshowData={slideshowData} lang={lang} />
    }
    
    if (image) {
      return <HeroImage image={image} lang={lang} className="hero__image" />
    }
    
    return <div style={{ background: "#f0f0f0", height: "300px" }}></div>
  }

  return (
    <section className="hero">
      <div className="hero__visual">
        {renderHeroMedia()}

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
        <div className="hero__ticker-wrapper" data-skip-read="true">
          <Marquee className="hero__ticker" data-skip-read="true">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} className="child">
                {ticker}
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
};

export default Hero;

