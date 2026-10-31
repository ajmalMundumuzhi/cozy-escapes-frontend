import { useEffect, useMemo, useState } from 'react'
import SearchBar from './SearchBar'
import useProperties from '../../hooks/useProperties'

const FALLBACK_IMAGE = 'https://assets.minorhotels.com/image/upload/q_auto,f_auto/media/minor/mhg/images/media/blog/2025-blog-post/09-australia-best-beaches/08.png'

export default function Hero() {
  const { properties = [] } = useProperties()
  const [activeIndex, setActiveIndex] = useState(0)

  const images = useMemo(() => {
    return [...properties]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0).getTime() -
          new Date(a.createdAt || a.updatedAt || 0).getTime()
      )
      .map((property) => {
        const firstImage = Array.isArray(property.images)
          ? property.images[0]
          : null

        if (typeof firstImage === 'string') {
          return firstImage
        }

        return (
          firstImage?.url ||
          firstImage?.secure_url ||
          firstImage?.src ||
          ''
        )
      })
      .filter(Boolean)
  }, [properties])

  useEffect(() => {
    setActiveIndex(0)
  }, [images.length])

  useEffect(() => {
    if (images.length < 2) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [images.length])

  const currentImage = images[activeIndex] || FALLBACK_IMAGE

  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden text-white md:h-screen">
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))
      ) : (
        <img
          src={currentImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#6f93b8]/30 via-black/10 to-[#2b3f55]/60" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-28 text-center">
        <h1 className="max-w-[900px] font-display text-3xl font-semibold italic leading-[1.05] md:text-4xl lg:text-[70px]">
          Elevated Short-Term Stays, Effortlessly Yours
        </h1>
      </div>

      <div className="relative z-20">
        <SearchBar />
      </div>
    </section>
  )
}