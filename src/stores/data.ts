import type { Car } from '@/model/Car'
import type { Driver } from '@/model/Driver'
import type { Laptime } from '@/model/Laptime'
import type { LaptimeWithData } from '@/model/LaptimeWithData'
import type { Location } from '@/model/Location'
import type { Stage } from '@/model/Stage'

import { cars as carsDb } from '@/assets/db/cars'
import { locations as locationsDb } from '@/assets/db/locations'
import { apiDelete, apiGet, apiPatch, apiPost, DRIVERS_ENDPOINT, TIMES_ENDPOINT } from '@/plugins/api'
import LaptimeUtil from '@/utils/LaptimeUtil'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, readonly } from 'vue'

export const useDataStore = defineStore('data', () => {
  const cars = ref<Car[]>(carsDb)
  const locations = ref<Location[]>(locationsDb.rally)
  const stages = ref<Stage[]>(locationsDb.rally.flatMap(location => [...location.forward, ...location.reverse]))
  const drivers = ref<Driver[]>([])
  const times = ref<Laptime[]>([])
  const activeLocation = ref<Location | null>(null)
  const activeStage = ref<Stage | null>(null)
  const rightPanelShow = ref<boolean>(false)
  const leftPanelShow = ref<boolean>(true)
  const locationsShow = ref<boolean>(true)
  const stagesShow = ref<boolean>(false)
  const carGroupFilter = ref<string>('Any')

  const carGroups = computed(() => ['Any', ...new Set(cars.value.map(x => x.group))])

  const fetchAll = async () => {
    await Promise.all([fetchDrivers(), fetchTimes()])
  }

  const fetchDrivers = async () => {
    drivers.value = await apiGet<Driver>(DRIVERS_ENDPOINT)
  }

  const fetchTimes = async () => {
    times.value = await apiGet<Laptime>(TIMES_ENDPOINT)
  }

  const showRightPanel = (show: boolean) => {
    rightPanelShow.value = show
  }

  const showLeftPanel = (show: boolean) => {
    leftPanelShow.value = show
  }

  const showLocations = (show: boolean) => {
    stagesShow.value = false
    locationsShow.value = show
  }

  const showStages = (show: boolean) => {
    locationsShow.value = false
    stagesShow.value = show
  }

  const setActiveLocation = (location: Location | null) => {
    activeLocation.value = location
    activeStage.value = null
  }

  const setActiveStage = (stage: Stage | null) => {
    activeStage.value = stage
  }

  const setCarGroupFilter = (group: string) => {
    carGroupFilter.value = group
  }

  const getTimesForStage = (stage: Stage): LaptimeWithData[] => {
    return times.value
      .filter(x => x.stageId === stage.id)
      .map(({ carId, driverId, locationId, stageId, ...laptime }) => ({
        ...laptime,
        car: cars.value.find(x => x.id === carId),
        driver: drivers.value.find(x => x.id === driverId),
        location: locations.value.find(x => x.id === locationId),
        stage: stages.value.find(x => x.id === stageId)
      }) as LaptimeWithData)
      .sort((a, b) => LaptimeUtil.compareLaptimes(a.time, b.time))
  }

  const getTimesForLocation = (location: Location): LaptimeWithData[] => {
    return times.value
      .filter(x => x.locationId === location.id)
      .map(({ carId, driverId, locationId, stageId, ...laptime }) => ({
        ...laptime,
        car: cars.value.find(x => x.id === carId),
        driver: drivers.value.find(x => x.id === driverId),
        location: locations.value.find(x => x.id === locationId),
        stage: stages.value.find(x => x.id === stageId)
      }) as LaptimeWithData)
      .sort((a, b) => LaptimeUtil.compareLaptimes(a.time, b.time))
  }

  const addDriver = async (name: string) => {
    const driver = { id: uuidv4(), name }
    await apiPost(DRIVERS_ENDPOINT, driver)
    await fetchDrivers()
  }

  const addLaptime = async (laptime: Partial<Laptime>) => {
    const time = { ...laptime, id: uuidv4() }
    await apiPost(TIMES_ENDPOINT, time)
    await fetchTimes()
  }

  const updateLaptime = async (laptime: Laptime) => {
    if (!laptime?.id) return
    await apiPatch(`${TIMES_ENDPOINT}?uid=eq.${laptime.id}`, laptime)
    await fetchTimes()
  }

  const deleteLaptime = async (laptimeId: string) => {
    await apiDelete(`${TIMES_ENDPOINT}?uid=eq.${laptimeId}`)
    await fetchTimes()
  }

  const isLocal = () => {
    return ['127.0.0.1:5173', 'dirt2.homelab.net'].includes(window.location.host)
  }

  // ponytail: O(n * s) where n=times, s=stages. Fine for 155 laps.
  const statistics = computed(() => {
    const yearFilter = yearFilterRef.value
    const filteredTimes = yearFilter
      ? times.value.filter(t => new Date(t.timestamp).getFullYear() === yearFilter)
      : times.value

    const stageTimeMap = new Map<number, string[]>()
    for (const t of filteredTimes) {
      const list = stageTimeMap.get(t.stageId) || []
      list.push(t.driverId)
      stageTimeMap.set(t.stageId, list)
    }

    const driverStats = new Map<string, { total: number; gold: number; silver: number; bronze: number }>()
    for (const [, driverIds] of stageTimeMap) {
      for (let i = 0; i < driverIds.length && i < 3; i++) {
        const stats = driverStats.get(driverIds[i]) || { total: 0, gold: 0, silver: 0, bronze: 0 }
        if (i === 0) stats.gold++
        else if (i === 1) stats.silver++
        else stats.bronze++
        driverStats.set(driverIds[i], stats)
      }
      for (const did of driverIds) {
        const stats = driverStats.get(did) || { total: 0, gold: 0, silver: 0, bronze: 0 }
        stats.total++
        driverStats.set(did, stats)
      }
    }

    return [...driverStats.entries()].map(([id, s]) => ({
      driverId: id,
      driverName: drivers.value.find(d => d.id === id)?.name || 'Unknown',
      ...s
    })).sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze)
  })

  const availableYears = computed(() => {
    const years = new Set(times.value.map(t => new Date(t.timestamp).getFullYear()))
    return [...years].sort((a, b) => b - a)
  })

  const yearFilterRef = ref<number | null>(null)
  const yearFilter = computed(() => yearFilterRef.value)
  const setYearFilter = (year: number | null) => { yearFilterRef.value = year }

  const statisticsModalShow = ref(false)
  const showStatisticsModal = () => { statisticsModalShow.value = true }
  const hideStatisticsModal = () => { statisticsModalShow.value = false }

  return {
    cars: readonly(cars),
    locations: readonly(locations),
    stages: readonly(stages),
    drivers: readonly(drivers),
    times: readonly(times),
    activeLocation: readonly(activeLocation),
    activeStage: readonly(activeStage),
    rightPanelShow: readonly(rightPanelShow),
    leftPanelShow: readonly(leftPanelShow),
    locationsShow: readonly(locationsShow),
    stagesShow: readonly(stagesShow),
    carGroupFilter: readonly(carGroupFilter),
    carGroups,
    fetchAll,
    fetchDrivers,
    fetchTimes,
    showRightPanel,
    showLeftPanel,
    showLocations,
    showStages,
    setActiveLocation,
    setActiveStage,
    setCarGroupFilter,
    getTimesForStage,
    getTimesForLocation,
    addDriver,
    addLaptime,
    updateLaptime,
    deleteLaptime,
    isLocal,
    statistics,
    availableYears,
    yearFilter,
    setYearFilter,
    statisticsModalShow,
    showStatisticsModal,
    hideStatisticsModal
  }
})
