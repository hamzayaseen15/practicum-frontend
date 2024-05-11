import { processGetAllParams } from '@src/helpers'
import axios from 'axios'

export const getCommunities = (params) => {
  const queryParams = processGetAllParams(params)
  return axios.get(`/communities?${queryParams.toString()}`)
}

export const getCommunity = (id) => {
  return axios.get(`/communities/${id}`)
}

export const createCommunity = (body) => {
  return axios.post('/communities', body)
}

export const updateCommunity = (id, body) => {
  return axios.put(`/communities/${id}`, body)
}

export const deleteCommunity = (id) => {
  return axios.delete(`/communities/${id}`)
}

export const getCommunityChat = (id) => {
  return axios.get(`/communities/${id}/chat`)
}

export const createCommunityMessage = (id, body) => {
  return axios.post(`/communities/${id}/chat`, body)
}

export const deleteCommunityMessage = (id, messageId) => {
  return axios.delete(`/communities/${id}/chat/${messageId}`)
}
