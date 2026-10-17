import { useEffect, useState } from 'react'
import Container from '../components/ui/Container'
import TermsHero from '../components/terms/TermsHero'
import TermsNav, { MobileNav } from '../components/terms/TermsNav'
import TermsSection from '../components/terms/TermsSection'
import { sections } from '../data/terms'

export default function TermsPage() {
  const [active, setActive] = useState(sections[0].id)

  // Highlight the section that is currently being read
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <TermsHero />
      <div>
        <MobileNav sections={sections} active={active} />
        <Container className="py-14 md:py-20">
          <div className="grid gap-16 lg:grid-cols-[260px_1fr]">
            <TermsNav sections={sections} active={active} />
            <div className="max-w-[760px]">
              {sections.map((s, i) => (
                <TermsSection key={s.id} section={s} index={i} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}