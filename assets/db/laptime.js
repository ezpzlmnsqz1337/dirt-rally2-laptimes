/**
 * Track direction enum
 */
export const TrackDirection = Object.freeze({
  FORWARD: 'forward',
  REVERSE: 'reverse'
})

/**
 * Creates new Track object
 *
 * @param {String} location location of the track
 * @param {String} name name of the track
 * @param {String} lengthKm length of the track in kilometers
 * @param {TrackDirection} direction "forward" or "reverse"
 * @returns new track object
 */
export function Track (location, name, lengthKm, direction) {
  return { location, name, lengthKm, direction }
}

/**
 * Creates new Car object
 *
 * @param {String} name name of the car
 * @param {String} group group of the car
 * @returns new Car object
 */
export function Car (name, group) {
  return { name, group }
}

export function Driver (name) {
  return { name }
}

/**
 * Creates new Laptime object
 *
 * @param {Car} car
 * @param {String} carGroup
 * @param {String} driver
 * @param {String} dateStr
 * @param {String} timestamp
 * @param {Track} track
 * @returns new Laptime object
 */
export function Laptime (car, carGroup, track, driver, dateStr, timestamp) {
  return { car, carGroup, track, driver, dateStr, timestamp }
}
