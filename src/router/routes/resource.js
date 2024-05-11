import { lazy } from 'react'

const ResourceList = lazy(() => import('@src/views/resources/List'))
const ResourceCreate = lazy(() => import('@src/views/resources/Create'))
const ResourceEdit = lazy(() => import('@src/views/resources/Edit'))

const ResourceRoutes = [
  {
    path: '/resources',
    element: <ResourceList />
  },
  {
    path: '/resources/create',
    element: <ResourceCreate />
  },
  {
    path: '/resources/:id/edit',
    element: <ResourceEdit />
  }
]

export default ResourceRoutes
