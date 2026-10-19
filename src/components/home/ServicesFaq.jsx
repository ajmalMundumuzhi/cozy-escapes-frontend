
import { useEffect, useState } from 'react'
import Container from '../ui/Container'
import { apiRequest } from '../../services/http'

export default function ServicesFaq() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadServices() {
      try {
        setLoading(true)
        setError(false)

        const result = await apiRequest('/services')

        if (!Array.isArray(result.data)) {
          throw new Error('Invalid services response')
        }

        if (!cancelled) {
          setServices(result.data)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setServices([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadServices()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h2 className="font-display font-medium tracking-tight text-5xl text-ink md:text-[48px]">
          Management Services
        </h2>

        <p className="mt-4 max-w-[660px] text-[17px] leading-6 text-body">
          Experience comfort and elegance with our carefully selected properties. Book your stay
          effortlessly and start your journey with us.
        </p>

        {loading && (
          <p className="mt-8 text-body" role="status">
            Loading services...
          </p>
        )}

        {!loading && error && (
          <p className="mt-8 text-body" role="status">
            Services are temporarily unavailable. Please try again later.
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="mt-8 text-body">
            No services are available at the moment.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
            {services.map((service, i) => (
              <article
                key={service._id || service.id || service.title}
                className="group flex gap-6 rounded-lg bg-gold-deep p-7 text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl md:p-8"
              >
                <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                  <span className="text-[13px] font-light">Step</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-gold-deep transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    {i + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-[22px] font-medium leading-snug">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-[15px] font-normal leading-[1.7] text-white/90">
                    {service.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
