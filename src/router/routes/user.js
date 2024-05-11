import { lazy } from 'react'

const UserList = lazy(() => import('@src/views/users/List'))
const UserCreate = lazy(() => import('@src/views/users/Create'))
const UserEdit = lazy(() => import('@src/views/users/Edit'))

const UserRoutes = [
  {
    path: '/users',
    element: <UserList />
  },
  {
    path: '/users/create',
    element: <UserCreate />
  },
  {
    path: '/users/:id/edit',
    element: <UserEdit />
  }
]

export default UserRoutes
