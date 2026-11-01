import { createTestingPinia } from '@pinia/testing'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { locations } from '@/assets/db/locations'
import ContentPanel from '@/components/ContentPanel.vue'
import { useDataStore } from '@/stores/data'

vi.mock('@/plugins/api', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  apiDelete: vi.fn(),
  DRIVERS_ENDPOINT: 'http://localhost:3003/drivers',
  TIMES_ENDPOINT: 'http://localhost:3003/times'
}))

const { apiGet, DRIVERS_ENDPOINT } = await import('@/plugins/api')
const mockApiGet = apiGet as ReturnType<typeof vi.fn>

const location = locations.rally[0]
const stage = location.forward[0]

const driver = { id: 'driver-1', name: 'Alice' }
const times = [
  {
    id: 'lap-1',
    carId: 1,
    driverId: driver.id,
    locationId: location.id,
    stageId: stage.id,
    time: '1:00.000',
    timestamp: 0,
    notes: ''
  }
]

// Modals listen on window: a leftover wrapper would swallow the next Escape.
const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
})

async function factory() {
  mockApiGet.mockImplementation((endpoint: string) =>
    Promise.resolve(endpoint === DRIVERS_ENDPOINT ? [driver] : times)
  )

  const pinia = createTestingPinia({ stubActions: false })
  const dataStore = useDataStore(pinia)
  await dataStore.fetchAll()
  dataStore.setActiveLocation(location)
  dataStore.setActiveStage(stage)

  const wrapper = mount(ContentPanel, {
    global: {
      plugins: [pinia],
      stubs: { CarGroupFilter: true, PulseLoader: true, 'v-select': true }
    }
  })
  mounted.push(wrapper)

  return { wrapper, dataStore }
}

describe('ContentPanel laptime detail', () => {
  it('opens the read-only detail on row click and edits as a second step', async () => {
    const { wrapper } = await factory()

    await wrapper.get('tbody tr').trigger('click')
    const detail = wrapper.get('[aria-label="Laptime detail"]')
    expect(detail.text()).toContain('Alice')

    await detail.get('button').trigger('click') // Edit
    expect(wrapper.find('[aria-label="Laptime detail"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="Edit laptime"]').exists()).toBe(true)
  })

  it('returns to the table when the edit modal closes', async () => {
    const { wrapper } = await factory()

    await wrapper.get('tbody tr').trigger('click')
    await wrapper.get('[aria-label="Laptime detail"] button').trigger('click')

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.find('[aria-label="Edit laptime"]').exists()).toBe(false)
    expect(wrapper.find('[aria-label="Laptime detail"]').exists()).toBe(false)
    expect(wrapper.find('tbody tr').exists()).toBe(true)
  })
})
