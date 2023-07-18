import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import { Box, ChakraProvider } from '@chakra-ui/react'

import routes from '~react-pages'

import "./lib/firebase"
import './main.css'

import { FirebaseAuthProvider } from './hook/firebase-auth'
import { LoadingSpinner } from './component/loading-spinner'

const Layout = (props: { children?: ReactNode }) => {
  return (
    <Box
      bg="gray.200"
    >
      <Box
        maxW={{ base: undefined, sm: 420 }}
        minH="100vh"
        bg="white"
        margin="0 auto"
      >
        {props.children}
      </Box>
    </Box>
  )
}

const App = () => {
  return (
    <ChakraProvider>
      <FirebaseAuthProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            {useRoutes(routes)}
          </Suspense>
        </Layout>
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
