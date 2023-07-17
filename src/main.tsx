import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import { ChakraProvider } from '@chakra-ui/react'

import routes from '~react-pages'

import "./lib/firebase"
import './main.css'

import { FirebaseAuthProvider } from './hook/firebase-auth'
import { LoadingSpinner } from './component/loading-spinner'

const App = () => {
  return (
    <ChakraProvider>
      <FirebaseAuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          {useRoutes(routes)}
        </Suspense>
      </FirebaseAuthProvider>
    </ChakraProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
