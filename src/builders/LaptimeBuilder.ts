import type { LaptimeComponents } from '@/model/Laptime'

const SECONDS_LENGTH = 2
const MILLISECONDS_LENGTH = 3

export default class LaptimeBuilder {
  // laptime pattern is 1-2 digits for minutes, 2 digits for seconds, 3 digits for milliseconds
  static pattern = /^(\d{1,2}):(\d{2})\.(\d{3})$/

  static compareLaptimes (laptime1: string, laptime2: string) {
    return this.laptimeToDate(laptime1)!.getTime() - this.laptimeToDate(laptime2)!.getTime()
  }

  static dateToLaptime (date: Date) {
    const [m, s, ms] = [date.getMinutes(), date.getSeconds(), date.getMilliseconds()].map(x => String(x))
    return `${m}:${s.padStart(SECONDS_LENGTH, '0')}.${ms.padStart(MILLISECONDS_LENGTH, '0')}`
  }

  static laptimeToDate (laptime: string) {
    const l1 = laptime.match(LaptimeBuilder.pattern)
    if (!l1) { return }
    return new Date(parseInt(l1[1]) * 60 * 1000 + parseInt(l1[2]) * 1000 + parseInt(l1[3]))
  }

  static getLaptimeDiff (laptime1: string, laptime2: string) {
    const time1 = this.laptimeToDate(laptime1)
    const time2 = this.laptimeToDate(laptime2)

    const diff = new Date(time2!.getTime() - time1!.getTime())

    return `+ ${this.dateToLaptime(diff)}`
  }

  static isLaptimeValid (minutes: string, seconds: string, milliseconds: string) {
    // check not set
    if ((minutes.length <= 0 || seconds.length !== SECONDS_LENGTH || milliseconds.length !== MILLISECONDS_LENGTH)) { return false }
    if (!`${minutes}:${seconds}.${milliseconds}`.match(LaptimeBuilder.pattern)) { return false }

    const [m, s, ms] = [minutes, seconds, milliseconds].map(x => parseInt(x))

    // check greater than zero
    if ((m < 0 || s < 0 || ms < 0)) { return false }
    // check in range
    if (s >= 60 || ms >= 1000) { return false }

    return true
  }

  static laptimeFromComponents (minutes:string, seconds:string, milliseconds:string) {
    return this.dateToLaptime(new Date(
      parseInt(minutes) * 60 * 1000 +
        parseInt(seconds) * 1000 +
        parseInt(milliseconds)
    ))
  }

  static componentsFromLaptime (laptime: string): LaptimeComponents | undefined {
    const components = laptime.match(LaptimeBuilder.pattern)
    if (!components) { return }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [full, minutes, seconds, milliseconds] = components
    return { minutes, seconds, milliseconds }
  }
}
