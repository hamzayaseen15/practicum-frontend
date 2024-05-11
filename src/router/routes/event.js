import { lazy } from 'react'

const EventList = lazy(() => import('@src/views/events/List'))
const EventCreate = lazy(() => import('@src/views/events/Create'))
const EventEdit = lazy(() => import('@src/views/events/Edit'))

const EventRoutes = [
  {
    path: '/events',
    element: <EventList />
  },
  {
    path: '/events/create',
    element: <EventCreate />
  },
  {
    path: '/events/:id/edit',
    element: <EventEdit />
  }
]

export default EventRoutes
