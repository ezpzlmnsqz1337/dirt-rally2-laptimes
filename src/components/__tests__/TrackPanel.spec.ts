import { describe, expect, it } from 'vitest'

import { locations } from '@/assets/db/locations'
import TrackPanel from '@/components/TrackPanel.vue'
import { useDataStore } from '@/stores/data'
import { createTestingPinia, type TestingOptions } from '@pinia/testing'
import { mount } from '@vue/test-utils'

function factory(options?: TestingOptions) {
  const wrapper = mount(TrackPanel, {
    global: {
      plugins: [createTestingPinia({ ...options, stubActions: false })],
    },
  })

  const dataStore = useDataStore()

  return { wrapper, dataStore }
}

describe('TrackPanel', () => {
  it('mounts properly', () => {
    const { wrapper } = factory()

    expect(wrapper).toBeDefined();
  })

  it('should call set activeStage with null when back button is clicked', () => {
    const { wrapper, dataStore } = factory({initialState: { activeLocation: locations.rally[0] }});

    (wrapper.vm as any).back()

    expect(dataStore.setActiveLocation).toHaveBeenCalledWith(null);
    expect(dataStore.activeLocation).toBeNull()
  })
})
