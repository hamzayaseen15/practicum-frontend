import { processGetAllParams } from '@src/helpers'
import axios from 'axios'

export const getEvents = (params) => {
  const queryParams = processGetAllParams(params)
  return axios.get(`/events?${queryParams.toString()}`)
}

export const getEvent = (id) => {
  return axios.get(`/events/${id}`)
}

export const createEvent = (body) => {
  return axios.post('/events', body)
}

export const updateEvent = (id, body) => {
  return axios.put(`/events/${id}`, body)
}

export const deleteEvent = (id) => {
  return axios.delete(`/events/${id}`)
}
