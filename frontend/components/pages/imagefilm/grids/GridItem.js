"use client"

import { useState } from "react"
import ImageCms from "@/components/utils/imageCms/imageCms"
import Modal from "@/components/utils/modal/modal"
import { cmsClientBrowser as cmsClient, ProjectModulesFields, RTE } from "@/utils/sanity"

const GridItem = ({ subpage, lang = "en", pageType = "imagefilm" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!subpage || !subpage.teaserImage) return null

  const title = typeof subpage.title === "object"
    ? subpage.title[lang] || subpage.title.en || ""
    : subpage.title || ""

  const handleClick = async () => {
    if (isModalOpen) {
      setIsModalOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const subpageType = pageType === "imagefilm" ? "imagefilmSubpage" : "eventSubpage"
      const slug = subpage.slug
      
      const fullContent = await cmsClient.fetch(`*[_type == "${subpageType}" && slug.current == $slug][0]{
        _id,
        _type,
        title {
          en,
          de
        },
        bodyText {
          en[] ${RTE},
          de[] ${RTE}
        },
        projectModules[] {
          ...,
          ${ProjectModulesFields}
        }
      }`, { slug })

      if (fullContent) {
        setModalContent(fullContent)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error fetching subpage content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  return (
    <>
      <div 
        className="grid-item" 
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClick()
          }
        }}
        aria-label={title || "Open project"}
      >
        <div className="grid-item__image-wrapper">
          <ImageCms 
            image={subpage.teaserImage} 
            alt={title}
            className="grid-item__image"
          />
        </div>
        {title && (
          <div className="grid-item__title">
            {title}
          </div>
        )}
        {isLoading && (
          <div className="grid-item__loading">Loading...</div>
        )}
      </div>

      {isModalOpen && modalContent && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          content={modalContent}
          lang={lang}
        />
      )}
    </>
  )
}

export default GridItem

