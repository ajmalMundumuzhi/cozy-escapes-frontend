
import { apiRequest } from './http'

export async function submitInquiry(payload) {
  return apiRequest('/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
