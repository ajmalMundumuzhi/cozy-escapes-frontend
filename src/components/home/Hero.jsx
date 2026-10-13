import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden md:min-h-[810px]">
      {/* Replace with the client's hero image */}
      <img
        src="https://picsum.photos/seed/cozy-hero/1900/900"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/45" />

      <div className="relative z-10 mx-auto max-w-[760px] px-4 text-center text-white">
        <h1 className="font-script text-5xl leading-tight md:text-7xl lg:text-[80px]">
          Stay Beyond Expectations
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-lg font-normal leading-snug md:text-[20px]">
          Discover thoughtfully curated stays designed for comfort, style, and effortless living.
        </p>
        <Button to="/accommodations" className="mt-10">Browse Properties</Button>
      </div>
    </section>
  )
}