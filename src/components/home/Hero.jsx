import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import useProperties from '../../hooks/useProperties'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/cozy-hero/1920/1080'

export default function Hero() {
  const { properties = [] } = useProperties()
  const [activeIndex, setActiveIndex] = useState(0)

  const images = [...properties]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0).getTime() -
        new Date(a.createdAt || a.updatedAt || 0).getTime()
    )
    .flatMap((property) => {
      const propertyImages = Array.isArray(property.images)
        ? property.images
        : property.images
          ? [property.images]
          : []

      return propertyImages
        .map((image) => {
          if (typeof image === 'string') return image
          return image?.url || image?.secure_url || image?.src || ''
        })
        .filter(Boolean)
    })
    .filter((image, index, allImages) => allImages.indexOf(image) === index)

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

  const currentIndex = images.length
    ? activeIndex % images.length
    : 0

  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden text-white md:h-screen">
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))
      ) : (
        <img
          src={FALLBACK_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#6f93b8]/30 via-black/10 to-[#2b3f55]/60" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-28 text-center">
        <h1 className="max-w-[900px] font-display text-5xl font-semibold italic leading-[1.05] md:text-7xl lg:text-[88px]">
          Stay Beyond Expectations
        </h1>
      </div>

      <div className="relative z-20">
        <SearchBar />
      </div>
    </section>
  )
}