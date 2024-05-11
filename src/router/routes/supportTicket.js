import { lazy } from 'react'

const SupportTicketList = lazy(() => import('@src/views/supportTickets/List'))
const SupportTicketCreate = lazy(() => import('@src/views/supportTickets/Create'))
const SupportTicketEdit = lazy(() => import('@src/views/supportTickets/Edit'))

const SupportTicketRoutes = [
  {
    path: '/support-tickets',
    element: <SupportTicketList />
  },
  {
    path: '/support-tickets/create',
    element: <SupportTicketCreate />
  },
  {
    path: '/support-tickets/:id/edit',
    element: <SupportTicketEdit />
  }
]

export default SupportTicketRoutes
