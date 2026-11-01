import { createTestingPinia } from '@pinia/testing'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import LaptimeDetailModal from '@/components/modals/LaptimeDetailModal.vue'
import type { LaptimeWithData } from '@/model/LaptimeWithData'
import { useDataStore } from '@/stores/data'

const laptime: LaptimeWithData = {
  id: 'lap-1',
  time: '3:12.456',
  timestamp: Date.UTC(2026, 4, 3, 14, 30),
  notes: 'Clean run',
  driver: { id: 'driver-1', name: 'Alice' },
  car: { id: 7, name: 'Ford Escort RS Cosworth', group: 'Group A' },
  location: {
    id: 1,
    name: 'Rally Argentina',
    countryCode: 'ar',
    coordinates: { lat: 0, lng: 0 },
    forward: [],
    reverse: []
  },
  stage: { id: 1, name: 'Las Juntas', lengthKm: '8.25' }
}

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
})

function factory(isLocal: boolean, gap?: string) {
  const pinia = createTestingPinia({ stubActions: false })
  const dataStore = useDataStore(pinia)
  vi.spyOn(dataStore, 'isLocal').mockReturnValue(isLocal)

  const wrapper = mount(LaptimeDetailModal, {
    props: { laptime, gap },
    global: { plugins: [pinia] }
  })
  mounted.push(wrapper)

  return { wrapper, dataStore }
}

describe('LaptimeDetailModal', () => {
  it('renders the laptime details read-only', () => {
    const { wrapper } = factory(true, '+ 0:02.000')
    const text = wrapper.text()

    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe('true')
    expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Laptime detail')
    expect(text).toContain('Alice')
    expect(text).toContain('3:12.456')
    expect(text).toContain('+ 0:02.000')
    expect(text).toContain('Ford Escort RS Cosworth · Group A')
    expect(text).toContain('Rally Argentina')
    expect(text).toContain('Las Juntas · 8.25 km')
    expect(text).toContain('Clean run')
    expect(text).toContain(new Date(laptime.timestamp).toLocaleString())
    expect(wrapper.findAll('input, textarea, select')).toHaveLength(0)
  })

  it('emits showEdit from the Edit button on local hosts', async () => {
    const { wrapper } = factory(true)

    const edit = wrapper.findAll('button').find(button => button.text() === 'Edit')
    expect(edit).toBeDefined()
    await edit?.trigger('click')

    expect(wrapper.emitted('showEdit')).toHaveLength(1)
  })

  it('hides the Edit button outside the homelab and still offers Close', async () => {
    const { wrapper } = factory(false)

    expect(wrapper.findAll('button').map(button => button.text())).toEqual(['Close'])

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
