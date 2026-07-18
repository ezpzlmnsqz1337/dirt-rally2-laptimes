import { objectToCamel, objectToSnake } from 'ts-case-convert'

const DB_URL = window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3003'
  : 'http://192.168.0.102:3003'

const DRIVERS_ENDPOINT = `${DB_URL}/drivers`
const TIMES_ENDPOINT = `${DB_URL}/times`

async function apiGet<T>(url: string): Promise<T[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`)
  const data = await res.json()
  return objectToCamel(data) as T[]
}

async function apiPost<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(objectToSnake(body))
  })
  if (!res.ok) throw new Error(`POST ${url}: ${res.status}`)
  return res.json()
}

async function apiPatch<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(objectToSnake(body))
  })
  if (!res.ok) throw new Error(`PATCH ${url}: ${res.status}`)
  return res.json()
}

async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${url}: ${res.status}`)
}

export { DB_URL, DRIVERS_ENDPOINT, TIMES_ENDPOINT, apiGet, apiPost, apiPatch, apiDelete }
