import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../ui/Container'

function Field({ label, children }) {
  return (
    <label className="flex flex-1 flex-col justify-center border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
      <span className="text-[13px] text-body">{label}</span>
      {children}
    </label>
  )
}

export default function SearchBar() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ checkin: '', checkout: '', guests: '1' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    navigate(`/accommodations?${new URLSearchParams(form)}`)
  }

  const input = 'mt-1 w-full bg-transparent text-[14px] text-body outline-none'

  return (
    <section className="bg-cream py-14 md:py-16">
      <Container>
        <h2 className="font-script text-5xl text-ink md:text-[56px]">Reserve Your Escape</h2>
        <p className="mt-4 max-w-[660px] text-[17px] leading-6 text-body">
          Experience comfort and elegance with our carefully selected properties. Book your stay
          effortlessly and start your journey with us.
        </p>

        <form onSubmit={submit} className="mt-10 flex flex-col border border-gray-200 bg-white md:flex-row">
          <Field label="Check-in">
            <input type="date" name="checkin" value={form.checkin} onChange={update} className={input} />
          </Field>
          <Field label="Check-out">
            <input type="date" name="checkout" value={form.checkout} onChange={update} className={input} />
          </Field>
          <Field label="Guests">
            <select name="guests" value={form.guests} onChange={update} className={input}>
              <option value="1">&gt;1</option>
              <option value="2">&gt;2</option>
              <option value="3">&gt;3</option>
            </select>
          </Field>
          <button type="submit" className="bg-gold-dark py-5 text-[17px] font-normal text-white hover:bg-gold md:w-[150px]">
            Search
          </button>
        </form>
      </Container>
    </section>
  )
}