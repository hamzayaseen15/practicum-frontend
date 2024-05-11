import { SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_STATUS } from '@src/constants'

export const getSupportTicketPriorityLabel = (priority) => {
  switch (priority) {
    case SUPPORT_TICKET_PRIORITY.NORMAL:
      return 'Normal'
    case SUPPORT_TICKET_PRIORITY.URGENT:
      return 'Urgent'

    default:
      return 'N/A'
  }
}

export const getSupportTicketStatusLabel = (type) => {
  switch (type) {
    case SUPPORT_TICKET_STATUS.PENDING:
      return 'Pending'
    case SUPPORT_TICKET_STATUS.RESOLVED:
      return 'Resolved'

    default:
      return 'N/A'
  }
}
