import { processGetAllParams } from '@src/helpers'
import axios from 'axios'

export const getUsers = (params) => {
  const queryParams = processGetAllParams(params)
  return axios.get(`/users?${queryParams.toString()}`)
}

export const getUser = (id) => {
  return axios.get(`/users/${id}`)
}

export const createUser = (body) => {
  return axios.post('/users', body)
}

export const updateUser = (id, body) => {
  return axios.put(`/users/${id}`, body)
}

export const deleteUser = (id) => {
  return axios.delete(`/users/${id}`)
}

export const getMyUserData = () => {
  return axios.get(`/users/me`)
}

export const getUserNotification = () => {
  return axios.get('/users/notifications')
}

export const updateUserNotification = () =>{
  return axios.post('/users/notifications/mark-all-as-read')
}

