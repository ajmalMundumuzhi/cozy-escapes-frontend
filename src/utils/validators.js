export function validateGuest(v) {
  const e = {}
  if (!v.firstName.trim()) e.firstName = 'Enter your first name'
  if (!v.lastName.trim()) e.lastName = 'Enter your last name'
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter a valid email address'
  if (v.phone.replace(/\D/g, '').length < 6) e.phone = 'Enter a valid phone number'
  if (!v.address.trim()) e.address = 'Enter your address'
  if (!v.city.trim()) e.city = 'Enter your city'
  if (!v.zip.trim()) e.zip = 'Enter your zip or postcode'
  if (!v.country.trim()) e.country = 'Enter your country'
  return e
}