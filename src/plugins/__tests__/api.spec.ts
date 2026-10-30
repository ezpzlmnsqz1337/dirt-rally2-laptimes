import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiPatch, apiPost } from '@/plugins/api'

const emptyResponse = (status: number) => ({
  ok: true,
  status,
  text: () => Promise.resolve('')
} as Response)

const jsonResponse = (body: unknown, status = 200) => ({
  ok: true,
  status,
  text: () => Promise.resolve(JSON.stringify(body))
} as Response)

describe('api write helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves POST without throwing when PostgREST returns an empty body', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(emptyResponse(201))

    await expect(apiPost('http://localhost:3003/drivers', { id: '1', name: 'Alice' })).resolves.toBeUndefined()
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3003/drivers', expect.objectContaining({ method: 'POST' }))
  })

  it('resolves PATCH without throwing on 204 No Content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(emptyResponse(204))

    await expect(apiPatch('http://localhost:3003/times?id=eq.1', { notes: 'test' })).resolves.toBeUndefined()
  })

  it('parses a representation when PostgREST returns one', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ id: '1', name: 'Alice' }))

    await expect(apiPost('http://localhost:3003/drivers', { id: '1', name: 'Alice' })).resolves.toEqual({ id: '1', name: 'Alice' })
  })
})
