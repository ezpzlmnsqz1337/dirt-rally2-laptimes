import { describe, expect, it } from 'vitest'

import { createTestingPinia, type TestingOptions } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import MapView from '@/components/MapView.vue'

function factory(options?: TestingOptions) {
  const wrapper = mount(MapView, {
    global: {
      plugins: [createTestingPinia({ ...options })],
    },
  })

  return { wrapper }
}

describe('MapView', () => {
  it('mounts properly', () => {
    const { wrapper } = factory()

    expect(wrapper).toBeDefined();
  })
})
