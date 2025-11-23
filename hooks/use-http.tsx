'use client'

import React from 'react'
import axios, { AxiosInstance } from 'axios'

const HttpContext = React.createContext<AxiosInstance | null>(null)

export const http = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
})

export function HttpProvider({ children }: { children: React.ReactNode }) {
  const [httpInstance, setHttpInstance] = React.useState<AxiosInstance | null>(
    null
  )

  React.useEffect(() => {
    if (!httpInstance) {
      http.interceptors.request.use(
        (config) => config,
        (error) => Promise.reject(error)
      )

      http.interceptors.response.use(
        (response) => response,
        (error) => Promise.reject(error)
      )

      setHttpInstance(http)
    }
  }, [httpInstance])

  return (
    <HttpContext.Provider value={httpInstance || http}>
      {children}
    </HttpContext.Provider>
  )
}

export default function useHttp() {
  const httpContext = React.useContext(HttpContext)

  if (!httpContext) {
    throw new Error('useHttp must be use within HttpProvider')
  }

  return httpContext
}
