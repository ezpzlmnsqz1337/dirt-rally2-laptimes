import { describe, expect, it } from 'vitest'
import LaptimeUtil from './LaptimeUtil'

describe('LaptimeUtil', () => {
  it('should correctly compare two laptimes', () => {
    const laptime1 = '1:23.456'
    const laptime2 = '2:00.123'

    expect(LaptimeUtil.compareLaptimes(laptime1, laptime2)).toBeLessThan(0)
    expect(LaptimeUtil.compareLaptimes(laptime2, laptime1)).toBeGreaterThan(0)
    expect(LaptimeUtil.compareLaptimes(laptime1, laptime1)).toBe(0)
  })

  it('should correctly convert date to laptime', () => {
    const date = new Date('1970-01-01T00:01:23.456Z')

    expect(LaptimeUtil.dateToLaptime(date)).toBe('1:23.456')
  })

  it('should correctly convert laptime to date', () => {
    const laptime = '1:23.456'

    expect(LaptimeUtil.laptimeToDate(laptime)).toEqual(new Date('1970-01-01T00:01:23.456Z'))
  })

  it('should correctly get laptime diff', () => {
    const laptime1 = '1:23.456'
    const laptime2 = '2:00.123'

    expect(LaptimeUtil.getLaptimeDiff(laptime1, laptime2)).toBe('+ 0:36.667')
  })

  it('should correctly validate laptime', () => {
    const validLaptime = ['1', '23', '456']
    const invalidLaptimes = [
      ['1', '23', '4567'],
      ['1', '65', '123'],
      ['1', '123', '123'],
      ['-1', '00', '123']
    ]

    expect(LaptimeUtil.isLaptimeValid(validLaptime[0], validLaptime[1], validLaptime[2])).toBe(true)
    invalidLaptimes.forEach(x => expect(LaptimeUtil.isLaptimeValid(x[0], x[1], x[2])).toBe(false))
  })

  it('should correctly convert components to laptime', () => {
    const components = ['1', '23', '456']

    expect(LaptimeUtil.laptimeFromComponents(components[0], components[1], components[2])).toBe('1:23.456')
  })

  it('should correctly convert laptime to components', () => {
    const laptime = '1:23.456'
    const components = LaptimeUtil.componentsFromLaptime(laptime)

    expect(components).toEqual({ minutes: '1', seconds: '23', milliseconds: '456' })
  })
})
