import { processGetAllParams } from '@src/helpers'
import axios from 'axios'

export const getSupportTickets = (params) => {
  const queryParams = processGetAllParams(params)
  return axios.get(`/support-tickets?${queryParams.toString()}`)
}

export const getSupportTicket = (id) => {
  return axios.get(`/support-tickets/${id}`)
}

export const createSupportTicket = (body) => {
  return axios.post('/support-tickets', body)
}

export const updateSupportTicket = (id, body) => {
  return axios.put(`/support-tickets/${id}`, body)
}

export const deleteSupportTicket = (id) => {
  return axios.delete(`/support-tickets/${id}`)
}

export const getSupportTicketChat = (id) => {
  return axios.get(`/support-tickets/${id}/chat`)
}

export const createSupportTicketMessage = (id, body) => {
  return axios.post(`/support-tickets/${id}/chat`, body)
}
