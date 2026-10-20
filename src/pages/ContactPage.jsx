import { useSearchParams } from 'react-router-dom'
import Container from '../components/ui/Container'
import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'
import { subjects } from '../data/contact'

export default function ContactPage() {
  const [params] = useSearchParams()
  const wanted = params.get('subject')
  // ?subject=owner pre-selects "List my property"
  const initialSubject = subjects.some((s) => s.value === wanted) ? wanted : 'general'

  return (
    <>
      <section className="bg-navy pb-28 pt-16 text-center text-white md:pb-36 md:pt-24">
        <Container>
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">Contact</p>
          <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
          <h1 className="mt-8 font-display text-5xl font-medium tracking-tight md:text-6xl">Get in Touch</h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[17px] font-light leading-8 text-white/75">
            Have a question about a stay, or want us to manage your property? We’re here to help.
          </p>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container className="-mt-16 md:-mt-24">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-0">
            <div className="border-t-2 border-gold bg-white p-8 shadow-xl ring-1 ring-black/5 md:p-12">
              <ContactForm initialSubject={initialSubject} />
            </div>
            <ContactInfo />
          </div>
        </Container>
      </section>
    </>
  )
}