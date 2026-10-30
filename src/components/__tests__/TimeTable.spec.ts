import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TimeTable from '@/components/TimeTable.vue'
import type { LaptimeWithData } from '@/model/LaptimeWithData'

const makeLaptime = (id: string, time: string, group: string): LaptimeWithData => ({
  id,
  time,
  timestamp: 0,
  notes: '',
  driver: { id: `driver-${id}`, name: `Driver ${id}` },
  car: { id: Number(id), name: `Car ${id}`, group }
})

describe('TimeTable', () => {
  it('computes losing gaps against the filtered group leader', () => {
    const wrapper = mount(TimeTable, {
      props: {
        group: 'Group B',
        times: [
          makeLaptime('1', '1:00.000', 'Group A'),
          makeLaptime('2', '1:01.000', 'Group A'),
          makeLaptime('3', '1:02.000', 'Group B'),
          makeLaptime('4', '1:03.000', 'Group B')
        ]
      }
    })

    const losing = wrapper.findAll('td.__losing')
    expect(losing).toHaveLength(2)
    expect(losing[0].text()).toBe('')
    expect(losing[1].text()).toBe('+ 0:01.000')
  })
})
