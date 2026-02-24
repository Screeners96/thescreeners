import { PortableText } from "@portabletext/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RTE = ({ text, lang = "en", color }) => {
  const textColor = color || "black";
  const [headingMap, setHeadingMap] = useState({});

  useEffect(() => {
    const content = Array.isArray(text) ? text : text?.[lang] || text?.en || [];
    if (!content || content.length === 0) return;

    const headings = content.filter(
      (block) => block.style && /^h[2-6]$/.test(block.style)
    );

    const usedLevels = headings
      .map((h) => parseInt(h.style.substring(1)))
      .sort((a, b) => a - b);

    const uniqueLevels = [...new Set(usedLevels)];
    const mappedLevels = {};

    // Start semantic heading from <h2>
    uniqueLevels.forEach((origLevel, index) => {
      mappedLevels[origLevel] = Math.min(6, 2 + index);
    });

    setHeadingMap(mappedLevels);
  }, [text, lang]);

  const hasVisibleContent = (children) =>
    children &&
    children.some((child) =>
      typeof child === "string"
        ? child.trim()
        : child?.props?.children?.some((c) => typeof c === "string" && c.trim())
    );

  const getSafeHeading = (originalTag) => {
    const level = parseInt(originalTag.substring(1));
    const safeLevel = headingMap[level] || 6;
    return `h${safeLevel}`;
  };

  const renderHeading = (originalTag) => ({ children }) => {
    if (!hasVisibleContent(children)) return null;
    const SemanticTag = getSafeHeading(originalTag);
    const visualClass = `heading-styled-as-${originalTag}`;
    return (
      <SemanticTag className={visualClass} style={{ color: textColor }}>
        {children}
      </SemanticTag>
    );
  };

  const myPortableTextComponents = {
    block: {
      normal: ({ children }) => <p style={{ color: textColor }}>{children}</p>,
      h2: renderHeading("h2"),
      h3: renderHeading("h3"),
      h4: renderHeading("h4"),
      h5: renderHeading("h5"),
      h6: renderHeading("h6"),
      blockquote: ({ children }) => (
        <blockquote style={{ color: textColor, borderLeftColor: textColor }}>
          {children}
        </blockquote>
      ),
    },

    types: {
      undefined: ({ value }) =>
        value?.children?.length > 0 ? (
          <p style={{ color: textColor }}>
            {value.children.map((child) => child.text).join(" ")}
          </p>
        ) : null,
    },

    marks: {
      link: ({ children, value }) => {
        const href = value?.href || value?.url;
        const hasText = hasVisibleContent(children);

        const getFallbackText = (url) => {
          if (!url) return "Link";
          try {
            return `Visit ${new URL(url).hostname.replace("www.", "")}`;
          } catch {
            return "External link";
          }
        };

        return (
          <a
            href={href}
            className="rtelink"
            target="_blank"
            style={{ color: textColor }}
            {...(!hasText && { "aria-label": getFallbackText(href) })}
          >
            {hasText ? children : getFallbackText(href)}
          </a>
        );
      },

      emailLink: ({ children, value }) => {
        const { email, subject } = value;
        const mailto = subject
          ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
          : `mailto:${email}`;
        const hasText = hasVisibleContent(children);

        return (
          <a href={mailto} className="rtelink email-link" style={{ color: textColor }}>
            {hasText ? children : email}
          </a>
        );
      },

      internalLink: ({ children, value }) => {
        const slug = value?.slug?.current;
        const hasText = hasVisibleContent(children);

        return slug ? (
          <Link href={slug}>{hasText ? children : "Internal link"}</Link>
        ) : (
          <span>{children}</span>
        );
      },
    },

    listItem: {
      bullet: ({ children }) => (
        <li>
          <div className="rte__li__bullet" style={{ backgroundColor: textColor }} />
          {children}
        </li>
      ),
    },
  };

  const content = Array.isArray(text) ? text : text?.[lang] || text?.en || [];
  if (!content || content.length === 0) return null;

  return <PortableText value={content} components={myPortableTextComponents} />;
};

export default RTE;
