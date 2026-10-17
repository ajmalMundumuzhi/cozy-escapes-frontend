import SearchBar from './SearchBar'

export default function Hero() {
  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden text-white md:h-screen">
      {/* Replace with the client's hero image */}
      <img
        src="https://picsum.photos/seed/cozy-hero/1920/1080"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#6f93b8]/30 via-transparent to-[#2b3f55]/50" />

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