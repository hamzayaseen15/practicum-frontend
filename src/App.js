import { Suspense, useEffect } from 'react'

// ** Router Import
import Router from './router/Router'
import useJwt from './@core/auth/jwt/useJwt'
import { getMyUserData } from './apis'

const App = () => {
  const { jwt } = useJwt()
  const user = jwt.getUser()

  useEffect(() => {
    if (user) {
      getMyUserData().then((res) => {
        jwt.setUserData(res.data)
      })
    }
  }, [])
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
