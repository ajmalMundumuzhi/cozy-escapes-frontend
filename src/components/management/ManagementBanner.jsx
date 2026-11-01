import { useState } from 'react'
import Container from '../ui/Container'
import PropertyAssessmentModal from './PropertyAssessmentModel'

export default function ManagementBanner() {
  const [showAssessment, setShowAssessment] = useState(false)

  return (
    <>
      <section className="py-12 md:py-20">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div>
              <h2 className="font-heading text-2xl font-normal uppercase leading-[1.05] tracking-tight text-black md:text-6xl lg:text-[50px]">
                Landlord Partnerships: Guaranteed Rent, Zero Hassle,
                Pristine Property
              </h2>

              <p className="mt-10 max-w-[560px] text-[17px] font-normal leading-[1.9] text-[#4a4a4a]">
                Your investment property should be an asset, not a second job.
                Traditional tenancies often come with missed payments, months
                of hidden wear and tear, and the constant stress of the unknown.

                <br /><br />

                We offer a smarter, completely hands-off alternative. By
                partnering with us, you secure a reliable long-term corporate
                tenant while we transform your property into premium short-term
                accommodation. You collect your rent stress-free, while we take
                care of absolutely everything else.

                <br /><br />

                See if your property qualifies for our corporate housing
                network. We will provide you with a free market rent analysis
                and a detailed overview of how we can protect your asset.
              </p>

              <button
                type="button"
                onClick={() => setShowAssessment(true)}
                className="mt-10 rounded-sm bg-green-950 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-green-900"
              >
                Let's Schedule a Property Assessment
              </button>
            </div>

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7iMcy5mPLtJxPKtpw34sVTP6kNis2vqFEo-m1pSyRqa1yHmeKgnJfABar&s=10"
              alt="Living room"
              className="aspect-[4/5] w-full rounded-lg object-cover md:min-h-[640px] md:aspect-auto"
            />
          </div>
        </Container>
      </section>

      {showAssessment && (
        <PropertyAssessmentModal
          onClose={() => setShowAssessment(false)}
        />
      )}
    </>
  )
}