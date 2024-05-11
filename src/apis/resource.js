import { processGetAllParams } from '@src/helpers'
import axios from 'axios'

export const getResources = (params) => {
  const queryParams = processGetAllParams(params)
  return axios.get(`/resources?${queryParams.toString()}`)
}

export const getResource = (id) => {
  return axios.get(`/resources/${id}`)
}

export const createResource = (body) => {
  return axios.post('/resources', body)
}

export const updateResource = (id, body) => {
  return axios.put(`/resources/${id}`, body)
}

export const deleteResource = (id) => {
  return axios.delete(`/resources/${id}`)
}
