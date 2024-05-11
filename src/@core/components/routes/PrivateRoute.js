/* eslint-disable react/prop-types */
// ** React Imports
import { Navigate } from 'react-router-dom'
import { Suspense } from 'react'

// ** JWT Hook Import
import useJwt from '@src/@core/auth/jwt/useJwt'

// ** Context Imports
// import { AbilityContext } from "@src/utility/context/Can"

// ** Spinner Import
import Spinner from '../spinner/Loading-spinner'

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  // const ability = useContext(AbilityContext)
  // const user = JSON.parse(localStorage.getItem("userData"))
  const { jwt } = useJwt()
  const token = jwt.getToken()

  if (route) {
    // let action = null
    // let resource = null
    let restrictedRoute = false

    if (route.meta) {
      // action = route.meta.action
      // resource = route.meta.resource
      restrictedRoute = route.meta.restricted
    }
    if (!token) {
      return <Navigate to="/login" />
    }
    if (token && restrictedRoute) {
      return <Navigate to="/" />
    }
    // if (user && restrictedRoute && user.role === 'client') {
    //   return <Navigate to="/access-control" />
    // }
    // if (user && !ability.can(action || 'read', resource)) {
    //   return <Navigate to="/misc/not-authorized" replace />
    // }
  }

  return <Suspense fallback={<Spinner className="content-loader" />}>{children}</Suspense>
}

export default PrivateRoute
