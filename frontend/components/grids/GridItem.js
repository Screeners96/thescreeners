"use client"

import { useState } from "react"
import ImageCms from "@/components/utils/imageCms/imageCms"
import Modal from "@/components/utils/modal/modal"

const GridItem = ({ subpage, lang = "en", pageType = "imagefilm" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  if (!subpage || !subpage.teaserImage) return null

  const title = typeof subpage.title === "object"
    ? subpage.title[lang] || subpage.title.en || ""
    : subpage.title || ""

  const handleClick = () => {
    if (isModalOpen) {
      setIsModalOpen(false)
      return
    }

    console.log('GridItem subpage data:', subpage)
    console.log('GridItem bodyText:', subpage?.bodyText)

    if (subpage && subpage.projectModules) {
      setModalContent({
        _id: subpage._id,
        _type: subpage._type,
        title: subpage.title,
        bodyText: subpage.bodyText || {},
        projectModules: subpage.projectModules
      })
      setIsModalOpen(true)
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

