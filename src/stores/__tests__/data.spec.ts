import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '@/stores/data'

vi.mock('@/plugins/api', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
  DRIVERS_ENDPOINT: 'http://localhost:3003/drivers',
  TIMES_ENDPOINT: 'http://localhost:3003/times',
  DB_URL: 'http://localhost:3003',
}))

const { apiGet } = await import('@/plugins/api')
const mockApiGet = apiGet as ReturnType<typeof vi.fn>

function makeTimes(stageDrivers: [number, ...string[]][]): object[] {
  let i = 0
  return stageDrivers.flatMap(([stageId, ...driverIds]) =>
    driverIds.map(driverId => ({
      id: String(i++),
      carId: 1,
      driverId,
      locationId: 1,
      stageId,
      time: `1:0${i}.000`,
      timestamp: Date.UTC(2023, 0, 1) + i * 1000,
      notes: ''
    }))
  )
}

const DRIVERS = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
  { id: 'c', name: 'Charlie' },
]

describe('data store statistics', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
    setActivePinia(createPinia())
  })

  it('counts medals per driver across stages', async () => {
    const store = useDataStore()
    mockApiGet.mockResolvedValueOnce(DRIVERS)
    mockApiGet.mockResolvedValueOnce(makeTimes([
      [1, 'a', 'b', 'c'],
      [2, 'b', 'a', 'c'],
      [3, 'a', 'c', 'b'],
      [4, 'a', 'b'],
    ]))

    await store.fetchAll()
    const stats = store.statistics

    expect(stats).toHaveLength(3)
    const alice = stats.find(s => s.driverId === 'a')!
    expect(alice.total).toBe(4)
    expect(alice.gold).toBe(3)
    expect(alice.silver).toBe(1)
    expect(alice.bronze).toBe(0)

    const bob = stats.find(s => s.driverId === 'b')!
    expect(bob.total).toBe(4)
    expect(bob.gold).toBe(1)
    expect(bob.silver).toBe(2)
    expect(bob.bronze).toBe(1)

    const charlie = stats.find(s => s.driverId === 'c')!
    expect(charlie.total).toBe(3)
    expect(charlie.gold).toBe(0)
    expect(charlie.silver).toBe(1)
    expect(charlie.bronze).toBe(2)
  })

  it('filters by year', async () => {
    const store = useDataStore()
    mockApiGet.mockResolvedValueOnce(DRIVERS)
    mockApiGet.mockResolvedValueOnce([
      { id: '1', carId: 1, driverId: 'a', locationId: 1, stageId: 1, time: '1:00.000', timestamp: Date.UTC(2023, 0, 1), notes: '' },
      { id: '2', carId: 1, driverId: 'b', locationId: 1, stageId: 1, time: '1:01.000', timestamp: Date.UTC(2023, 0, 1), notes: '' },
      { id: '3', carId: 1, driverId: 'a', locationId: 1, stageId: 2, time: '1:00.000', timestamp: Date.UTC(2024, 0, 1), notes: '' },
    ])

    await store.fetchAll()
    expect(store.statistics).toHaveLength(2)

    store.setYearFilter(2023)
    const s2023 = store.statistics
    expect(s2023).toHaveLength(2)
    expect(s2023.find(s => s.driverId === 'a')!.total).toBe(1)

    store.setYearFilter(2024)
    const s2024 = store.statistics
    expect(s2024).toHaveLength(1)
    expect(s2024[0].driverId).toBe('a')
    expect(s2024[0].total).toBe(1)
  })

  it('returns available years sorted desc', async () => {
    const store = useDataStore()
    mockApiGet.mockResolvedValueOnce([])
    mockApiGet.mockResolvedValueOnce([
      { id: '1', carId: 1, driverId: 'a', locationId: 1, stageId: 1, time: '1:00.000', timestamp: Date.UTC(2023, 0, 1), notes: '' },
      { id: '2', carId: 1, driverId: 'a', locationId: 1, stageId: 1, time: '1:01.000', timestamp: Date.UTC(2024, 0, 1), notes: '' },
    ])

    await store.fetchAll()
    expect(store.availableYears).toEqual([2024, 2023])
  })

  it('handles empty data', async () => {
    const store = useDataStore()
    mockApiGet.mockResolvedValueOnce([])
    mockApiGet.mockResolvedValueOnce([])

    await store.fetchAll()
    expect(store.statistics).toEqual([])
    expect(store.availableYears).toEqual([])
  })

  it('handles single-driver stages', async () => {
    const store = useDataStore()
    mockApiGet.mockResolvedValueOnce([{ id: 'a', name: 'Alice' }])
    mockApiGet.mockResolvedValueOnce(makeTimes([[1, 'a'], [2, 'a'], [3, 'a']]))

    await store.fetchAll()
    const stats = store.statistics
    expect(stats).toHaveLength(1)
    expect(stats[0].total).toBe(3)
    expect(stats[0].gold).toBe(3)
    expect(stats[0].silver).toBe(0)
    expect(stats[0].bronze).toBe(0)
  })
})
