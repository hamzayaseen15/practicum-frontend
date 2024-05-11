// ** React Imports
import { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// ** Redux Imports
import { store } from './redux/store'
import { Provider } from 'react-redux'

// ** ThemeColors Context

import { ThemeContext } from './utility/context/ThemeColors'

// ** ThemeConfig
import themeConfig from './configs/themeConfig'

// ** Toast
import { Toaster } from 'react-hot-toast'

// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner'

// ** Ripple Button
import './@core/components/ripple-button'

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Hot Toast Styles
import '@styles/react/libs/react-hot-toasts/react-hot-toasts.scss'

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'

// ** Service Worker
import * as serviceWorker from './serviceWorker'

// ** react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import axios from 'axios'

const queryClient = new QueryClient()

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <ThemeContext>
            <LazyApp />
            <Toaster position={themeConfig.layout.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
          </ThemeContext>
        </Suspense>
      </Provider>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
