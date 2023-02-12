import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('Map', () => {
  it('mounts properly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper).toBeDefined();
  })
})
