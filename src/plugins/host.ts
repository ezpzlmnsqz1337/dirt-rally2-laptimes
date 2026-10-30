const LOOPBACK_HOSTNAMES = ['localhost', '::1']
const PRIVATE_IPV4 = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/

export const isLoopbackHost = (hostname: string = window.location.hostname) => {
  return LOOPBACK_HOSTNAMES.includes(hostname) || hostname.startsWith('127.')
}

export const isLocalHost = (hostname: string = window.location.hostname) => {
  return isLoopbackHost(hostname) ||
    PRIVATE_IPV4.test(hostname) ||
    hostname === 'homelab.net' ||
    hostname.endsWith('.homelab.net') ||
    hostname.endsWith('.local')
}
