"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3PQ_b5n5HyLnLYiIkXOL4iVTQzPVAs30",
  authDomain: "evolution-training-9a02d.firebaseapp.com",
  projectId: "evolution-training-9a02d",
  storageBucket: "evolution-training-9a02d.appspot.com",
  messagingSenderId: "704903585599",
  appId: "1:704903585599:web:ff8b5d682e30e6f269bd8a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
