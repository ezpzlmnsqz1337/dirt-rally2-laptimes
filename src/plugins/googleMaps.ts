import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  v: 'weekly'
})

export const apiPromise = Promise.all([
  importLibrary('maps'),
  importLibrary('marker')
]).then(() => (window as any).google)
