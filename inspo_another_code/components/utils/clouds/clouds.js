"use client"

import { useEffect, useRef } from "react"

function bm(sgm = 1) {
  const len = sgm * Math.sqrt(-2 * Math.log(Math.random()))
  const ang = 2 * Math.PI * Math.random()
  return [len * Math.cos(ang), len * Math.sin(ang)]
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

const getWindowDim = () => [window.innerWidth, window.innerHeight]
const N = 12
const rds = 20

export default function Clouds({ colors, height, position, width }) {
  const bgRef = useRef()
  const { current: items } = useRef(Array.from({ length: N }, () => ({})))
  const prevScrollY = useRef(0)
  const scrollDirection = useRef(0)
  const scrollSpeed = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef(null)
  const animationFrameId = useRef(null)
  const lastTimestamp = useRef(0)
  const timeOffset = useRef(Array.from({ length: N }, () => Math.random() * 10000))

  useEffect(() => {
    let [w, h] = getWindowDim()
    for (const item of items) {
      item.el.style.display = "block"
      item.p = [0, 0]
      item.q =
        w < h
          ? [100 * Math.random() - rds, (100 * h * Math.random()) / w - rds]
          : [(100 * w * Math.random()) / h - rds, 100 * Math.random() - rds]


      item.targetQ = [...item.q]


      item.directionFactor = (Math.random() * 2 - 1) * 0.8


      item.amplitude = 0.5 + Math.random() * 1.5 
      item.frequency = 0.0001 + Math.random() * 0.0002 
      item.phase = Math.random() * Math.PI * 2 
    }

    
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      const newDirection = currentScrollY > prevScrollY.current ? 1 : -1
      scrollDirection.current = newDirection


      const rawSpeed = Math.abs(currentScrollY - prevScrollY.current) * 0.1
      scrollSpeed.current = scrollSpeed.current * 0.6 + rawSpeed * 0.4

      prevScrollY.current = currentScrollY

      isScrolling.current = true


      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }


      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    let ori = null


    const animate = (timestamp) => {

      const deltaTime = lastTimestamp.current ? (timestamp - lastTimestamp.current) / 16 : 1
      lastTimestamp.current = timestamp

  
      const dt = Math.min(deltaTime, 3)
      ;[w, h] = getWindowDim()
      let dim, nori, u
      if (w < h) {
        dim = [100, (100 * h) / w]
        nori = 0
        u = `vw`
      } else {
        dim = [(100 * w) / h, 100]
        nori = 1
        u = `vh`
      }

      if (ori != nori) {
        ori = nori
        for (const { el } of items) {
          el.style.width = el.style.height = `${2 * rds}${u}`
          bgRef.current.style.filter = `blur(10${u})`
        }
      }


      if (isScrolling.current && scrollSpeed.current > 0.01) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const { targetQ, directionFactor } = item


          const scrollInfluence = scrollDirection.current * scrollSpeed.current * 2

         
          for (const j of [0, 1]) {
            
            const axisInfluence = j === 0 ? directionFactor : -directionFactor * 0.7

           
            targetQ[j] += scrollInfluence * axisInfluence

            
            targetQ[j] = Math.max(-rds * 1.5, Math.min(targetQ[j], dim[j] - rds * 0.5))
          }
        }
      } else {
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const { targetQ, amplitude, frequency, phase } = item
          const time = timestamp + timeOffset.current[i]

          
          const xMovement = Math.sin(time * frequency + phase) * amplitude * 0.05
          const yMovement = Math.cos(time * frequency * 0.7 + phase) * amplitude * 0.03

          
          targetQ[0] += xMovement * dt
          targetQ[1] += yMovement * dt

        
          const [randX, randY] = bm(0.01)
          targetQ[0] += randX * dt
          targetQ[1] += randY * dt

         
          targetQ[0] = Math.max(-rds * 1.5, Math.min(targetQ[0], dim[0] - rds * 0.5))
          targetQ[1] = Math.max(-rds * 1.5, Math.min(targetQ[1], dim[1] - rds * 0.5))

        
          if (targetQ[0] <= -rds * 1.5 || targetQ[0] >= dim[0] - rds * 0.5) {
            targetQ[0] += (Math.random() - 0.5) * 0.5
          }
          if (targetQ[1] <= -rds * 1.5 || targetQ[1] >= dim[1] - rds * 0.5) {
            targetQ[1] += (Math.random() - 0.5) * 0.5
          }
        }
      }

 
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const { el, q, targetQ } = item


        const transitionSpeed = isScrolling.current ? 0.1 : 0.03

        for (const j of [0, 1]) {
 
          q[j] += (targetQ[j] - q[j]) * transitionSpeed * dt
        }

   
        el.style.transform = `translate(${q[0]}${u},${q[1]}${u})`

   
        const movementSpeed = Math.sqrt(Math.pow(targetQ[0] - q[0], 2) + Math.pow(targetQ[1] - q[1], 2))

        const baseOpacity = 0.6
        const opacityVariation = 0.3
        const opacity = baseOpacity + opacityVariation * Math.min(movementSpeed / 10, 1)

        el.style.background = colors[i % colors.length]
        el.style.opacity = opacity.toString()
      }

   
      if (!isScrolling.current) {
        scrollSpeed.current *= 0.9
      }

   
      animationFrameId.current = requestAnimationFrame(animate)
    }


    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [colors])

  return (
    <div className="background" style={{ width, height, position }}>
      <div className="background__isolate" ref={bgRef}>
        {Array.from({ length: N }, (_, i) => (
          <div
            className="background__item"
            style={{
              background: colors[i % colors.length],
              display: "none",
            }}
            ref={(el) => {
              items[i].el = el
            }}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}
