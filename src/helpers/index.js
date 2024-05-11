import { API_URL } from '@src/constants'

export * from './notification'
export * from './supportTicket'
export * from './user'

/**
 * get error message from error object
 * @param {*} err
 * @param {string} defaultMessage
 * @returns
 */
export const getResponseErrorMessage = (err, defaultMessage) => {
  const message =
    err?.response?.data?.error ??
    err?.response?.data?.message ??
    err?.response?.message ??
    err?.message ??
    defaultMessage ??
    'Something went wrong'
  return message
}

/**
 * get url search params object from params object
 * @param {object} params
 * @param {{[fieldName: string]: [filterValue: string|object]}} params.filters
 * @param {[{field: string, type: 'asc'|'desc'}]} params.sort
 * @param {number} params.perPage
 * @param {number} params.page
 * @returns
 */
export const processGetAllParams = (params) => {
  const queryParams = new URLSearchParams()
  if (params?.filters) queryParams.append('filters', JSON.stringify(params.filters))
  if (params?.page) queryParams.append('page', params.page)
  if (params?.perPage) queryParams.append('perPage', params.perPage)
  if (params?.sort) queryParams.append('sort', JSON.stringify(params.sort))

  return queryParams
}

export const getFileUrl = (file) => {
  if (!file) return null
  const url = new URL(file.path, API_URL)
  return url.href
}
