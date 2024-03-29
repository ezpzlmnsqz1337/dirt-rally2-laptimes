import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import firebaseConfig from '@/plugins/firebaseConfig'

const debug = false

// Get a Firestore instance
initializeApp(firebaseConfig)
const db = getFirestore()

if (debug) {
  console.warn('You are in debug mode')
  connectFirestoreEmulator(db, 'localhost', 9080)
}

export { db }
