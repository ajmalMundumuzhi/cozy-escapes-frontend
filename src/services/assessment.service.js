import { apiRequest } from './http'

export async function submitPropertyAssessment(payload) {
  return apiRequest('/property-assessments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}