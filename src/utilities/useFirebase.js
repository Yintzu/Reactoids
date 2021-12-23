import { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore"
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
const db = getFirestore(app)
console.log("initiated DB")
// const analytics = getAnalytics(app);

const collectionRef = collection(db, 'highscore')
const queryRef = query(collectionRef, orderBy('score', 'desc'))


const useFirebase = () => {
  const [highscore, setHighscore] = useState([])

  const postHighscore = async ({ name, score }) => {
    const docRef = await addDoc(collectionRef, {
      name,
      score
    })
    return docRef.id
  }

  const deleteHighscore = async (id) => {
    const deleteRef = doc(db, 'highscore', id)
    return await deleteDoc(deleteRef)
  }

  useEffect(() => {
    const unsub = onSnapshot(queryRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setHighscore(data.slice(0, 10))
    })

    return unsub
  }, [])

  return {
    highscore,
    postHighscore,
    deleteHighscore
  }
}

export default useFirebase
