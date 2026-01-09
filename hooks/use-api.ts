"use client"

import { useCallback, useState } from "react"

interface UseApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: Record<string, any>
}

export function useApi<T>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const call = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url, {
        method: options?.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { data, loading, error, call }
}
