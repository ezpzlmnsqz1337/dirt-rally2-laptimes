import { describe, expect, it } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import { useDataStore } from './data'

function factory() {
  setActivePinia(createPinia())

  const dataStore = useDataStore()

  return { dataStore }
}

describe('data', () => {
  it('should be defined', () => {
    const { dataStore } = factory()

    expect(dataStore).toBeDefined();
  })
})
