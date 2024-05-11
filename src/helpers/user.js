import { USER_TYPE } from '@src/constants'

export const getUserTypeLabel = (type) => {
  switch (type) {
    case USER_TYPE.ADMIN:
      return 'Admin'
    case USER_TYPE.SUB_ADMIN:
      return 'Local Authorities'
    case USER_TYPE.USER:
      return 'Residents'

    default:
      return 'N/A'
  }
}
