
export default function AssessmentStepTwo({ values, onChange }) {
  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-3 block font-semibold text-[#333333]">
          How many bedrooms does your property have?
        </span>

        <input
          type="number"
          name="bedrooms"
          min="0"
          max="100"
          required
          value={values.bedrooms}
          onChange={onChange}
          placeholder="Number of bedrooms"
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-[#333333] outline-none transition-colors focus:border-[#173B32] focus:ring-2 focus:ring-[#D9BD83]/40"
        />
      </label>

      <label className="block">
        <span className="mb-3 block font-semibold text-[#333333]">
          Address
        </span>

        <textarea
          name="address"
          required
          rows={3}
          value={values.address}
          onChange={onChange}
          placeholder="Enter your property address"
          className="w-full resize-y rounded-sm border border-gray-300 bg-white px-4 py-3 text-[#333333] outline-none transition-colors focus:border-[#173B32] focus:ring-2 focus:ring-[#D9BD83]/40"
        />
      </label>
    </div>
  )
}
