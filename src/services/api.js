// TODO: replace with fetch(`${import.meta.env.VITE_API_URL}/inquiries`, { method: 'POST', ... })
export async function submitInquiry(payload) {
  console.log('Inquiry payload (not sent anywhere yet):', payload)
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { ok: true }
}