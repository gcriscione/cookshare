// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

//configurazione del database di firebase
const firebaseConfig = {
  apiKey: "AIzaSyBvr7GrFrPJ2ieCp8Vg6Tr8mQcg3qRy4MQ",
  authDomain: "cookshare-a9ce4.firebaseapp.com",
  projectId: "cookshare-a9ce4",
  storageBucket: "cookshare-a9ce4.appspot.com",
  messagingSenderId: "322994241297",
  appId: "1:322994241297:web:685c2d3e895c23917a56b0",
  measurementId: "G-B27EMYN1R3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(
  app,
  {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }
);
const storage = getStorage(app);

export{ auth, db, storage }