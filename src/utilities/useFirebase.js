import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCoKuuV7mNEPJ4uITQtQt0ThMxUmLV9OVY",
  authDomain: "reactoids-5ac95.firebaseapp.com",
  projectId: "reactoids-5ac95",
  storageBucket: "reactoids-5ac95.appspot.com",
  messagingSenderId: "417459623955",
  appId: "1:417459623955:web:fd49bb1ab372177fcd07e6",
  measurementId: "G-566NH3HZ9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
const db = getFirestore(app)
console.log("initiated DB")

const collectionRef = collection(db, 'highscore')


const useFirebase = () => {
  const [highscore, setHighscore] = useState()

  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (snapshot) => {
      // console.log(`snapshot`, snapshot)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(`data`, data)
      setHighscore(data)
    })

    return unsub
  }, [])

  return {
    highscore
  }
}

export default useFirebase
