import { addDoc, doc, getFirestore, runTransaction } from "firebase/firestore"
import { app } from "./firebase"
import { getRandomId } from "./id"

export const firestore = getFirestore(app)

export const addDocSafely: typeof addDoc = (reference, data) => {
  return runTransaction(firestore, async transaction => {
    let id = ""
    while (true) {
      id = getRandomId()
      console.log("gen: ", id)
      const snapshot = await transaction.get(doc(reference, id))
      if (!snapshot.exists()) {
        break
      }
    }

    const ref = doc(reference, id)
    transaction.set(ref, data)
    return ref
  })
}