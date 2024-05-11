import { lazy } from 'react'

const Login = lazy(() => import('../../views/auth/Login'))
const Register = lazy(() => import('../../views/auth/Register'))
const ForgotPassword = lazy(() => import('../../views/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../../views/auth/ResetPassword'))

const AuthRoutes = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      layout: 'blank',
      restricted: true,
      publicRoute: true
    }
  },
  {
    path: '/register',
    element: <Register />,
    meta: {
      layout: 'blank',
      restricted: true,
      publicRoute: true
    }
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    meta: {
      layout: 'blank',
      restricted: true,
      publicRoute: true
    }
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    meta: {
      layout: 'blank',
      restricted: true,
      publicRoute: true
    }
  }
]

export default AuthRoutes
