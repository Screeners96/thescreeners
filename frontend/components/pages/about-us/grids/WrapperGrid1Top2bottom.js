import { useEffect, useRef } from "react"
import WrapperRenderer from "../wrappers"

const WrapperGrid1Top2bottom = ({ grid, lang = "en" }) => {
  const wrapperRef = useRef(null)

  if (!grid) return null

  const top = grid.top || []
  const bottomLeft = grid.bottomLeft || []
  const bottomRight = grid.bottomRight || []

  useEffect(() => {
    const equalizeHeights = () => {
      if (!wrapperRef.current) return

      const wrapper = wrapperRef.current

      if (wrapper.closest('.about-us-grids-slider__slide')) return

      const topSection = wrapper.querySelector('.grid-wrapper__top')
      const bottomLeftSection = wrapper.querySelector('.grid-wrapper__bottom-left')
      const bottomRightSection = wrapper.querySelector('.grid-wrapper__bottom-right')

      const resetHeights = (section) => {
        if (!section) return
        const items = Array.from(section.children)
        items.forEach(item => {
          item.style.height = ''
        })
      }

      const setEqualHeights = (section) => {
        if (!section) return
        const items = Array.from(section.children)
        if (items.length === 0) return
        
        resetHeights(section)
        
        const heights = items.map(item => {
          const computedStyle = window.getComputedStyle(item)
          item.style.height = 'auto'
          return item.getBoundingClientRect().height
        })
        
        const maxHeight = Math.max(...heights)
        items.forEach(item => {
          item.style.height = `${maxHeight}px`
        })
      }

      setEqualHeights(topSection)
      setEqualHeights(bottomLeftSection)
      setEqualHeights(bottomRightSection)
    }

    equalizeHeights()

    const resizeObserver = new ResizeObserver(() => {
      equalizeHeights()
    })

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    window.addEventListener('resize', equalizeHeights)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', equalizeHeights)
    }
  }, [grid])

  return (
    <li ref={wrapperRef} className="grid-wrapper grid-wrapper--1-top-2-bottom">
      <div className="grid-wrapper__top">
        {top.map((wrapper, idx) => (
          <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
        ))}
      </div>
      <div className="grid-wrapper__bottom">
        <div className="grid-wrapper__bottom-left">
          {bottomLeft.map((wrapper, idx) => (
            <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
          ))}
        </div>
        <div className="grid-wrapper__bottom-right">
          {bottomRight.map((wrapper, idx) => (
            <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
          ))}
        </div>
      </div>
    </li>
  )
}

export default WrapperGrid1Top2bottom

