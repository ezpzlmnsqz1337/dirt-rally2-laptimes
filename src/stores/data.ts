import type { Car } from '@/model/Car'
import type { Driver } from '@/model/Driver'
import type { Laptime } from '@/model/Laptime'
import type { LaptimeWithData } from '@/model/LaptimeWithData'
import type { Location } from '@/model/Location'
import type { Stage } from '@/model/Stage'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'

import { cars as carsDb } from '@/assets/db/cars'
import { locations as locationsDb } from '@/assets/db/locations'
import LaptimeUtil from '@/utils/LaptimeUtil'
import { db } from '@/plugins/firebase'
import { collection, CollectionReference, deleteDoc, doc, enableIndexedDbPersistence, onSnapshot, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, readonly } from 'vue'

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Unable to activate local persistance, failed-precondition')
    } else if (err.code === 'unimplemented') {
      console.log('Unable to activate local persistance, unidentified browser')
    }
  })

export const useDataStore = defineStore('data', () => {
  const subs = ref<Subscription[]>([])
  const cars = ref<Car[]>(carsDb)
  const locations = ref<Location[]>(locationsDb.rally)
  const stages = ref<Stage[]>([])
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

  const subscribeDb = () => {
    bindFirestoreCollection<Driver>('drivers', drivers.value, collection(db, 'drivers'))
    bindFirestoreCollection<Laptime>('times', times.value, collection(db, 'laptimes'))
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

  const clearFirestoreCollection = <T>(collection: T[]) => {
    collection.splice(0)
  }

  const getTimesForStage = (stage: Stage): LaptimeWithData[] => {
    return times.value
      .filter((x: { stageId: any }) => x.stageId === stage.id)
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
    const docRef = doc(db, 'drivers', driver.id)
    await setDoc(docRef, driver)
  }

  const addLaptime = async (laptime: Partial<Laptime>) => {
    const time = { ...laptime, id: uuidv4(), dateString: new Date(laptime.timestamp!).toLocaleDateString('en-GB') }
    const docRef = doc(db, 'laptimes', time.id)
    await setDoc(docRef, time)
  }

  const updateLaptime = async (laptime: Laptime) => {
    if (!laptime || !laptime.id) {
      return
    }
    const docRef = doc(db, 'laptimes', laptime.id)
    await setDoc(docRef, laptime, { merge: true })
  }

  const deleteLaptime = async (laptimeId: string) => {
    const docRef = doc(db, 'laptimes', laptimeId)
    await deleteDoc(docRef)
  }

  // firebase
  const addFirestoreDocument = <T>(collection: T[], data: DocumentData) => {
    collection.push(data as T)
  }

  const modifyFirestoreDocument = <T extends { id: string }>(collection: T[], data: DocumentData) => {
    const index: number = collection.findIndex(x => x.id === data.id);
    collection.splice(index, 1, data as T)
  }

  const removeFirestoreDocument = <T extends { id: string }>(collection: T[], data: DocumentData) => {
    const index: number = collection.findIndex(x => x.id === data.id);
    collection.splice(index, 1)
  }

  const addSubscription = ({ key, unsubscribe }: Subscription) => {
    subs.value.push({ key, unsubscribe })
  }


  const unsubscribe = (key: string) => {
    const index = subs.value.findIndex(x => x.key === key)
    if (index === -1) {
      return
    }
    subs.value[index].unsubscribe()
    subs.value.splice(index, 1)
  }


  const unsubscribeAll = () => {
    subs.value.forEach(x => x.unsubscribe())
    subs.value.splice(0)
  }


  const bindFirestoreCollection = <T extends { id: string }>(key: string, collection: T[], collectionRef: CollectionReference) => {
    unsubscribe(key)
    clearFirestoreCollection<T>(collection)
    const unsub = onSnapshot(collectionRef,
      snapshot => snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          addFirestoreDocument<T>(collection, change.doc.data())
        }
        if (change.type === 'modified') {
          modifyFirestoreDocument<T>(collection, change.doc.data())
        }
        if (change.type === 'removed') {
          removeFirestoreDocument<T>(collection, change.doc.data())
        }
      })
    )
    addSubscription({ key, unsubscribe: unsub })
  }

  return {
    // state
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

    // getters
    carGroups,

    // actions
    subscribeDb,
    showRightPanel,
    showLeftPanel,
    showLocations,
    showStages,
    setActiveLocation,
    setActiveStage,
    setCarGroupFilter,
    getTimesForStage,
    addDriver,
    addLaptime,
    updateLaptime,
    deleteLaptime,

    // firestore
    unsubscribeAll
  }
})

export interface Subscription {
  key: string
  unsubscribe: Unsubscribe
}
