import { initializeApp } from "firebase/app"
import { Analytics, getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const config = {
  apiKey: "AIzaSyBEl52Z8qp8HgRkF2fV55AedVRgLjnCEFc",
  authDomain: "qrcode-pre-generator.firebaseapp.com",
  projectId: "qrcode-pre-generator",
  storageBucket: "qrcode-pre-generator.appspot.com",
  messagingSenderId: "975295045300",
  appId: "1:975295045300:web:fe0f0a907b8c245a33c1e1",
  measurementId: "G-DVDBGXZXGW",
}

export const app = initializeApp(config)

export const auth = getAuth(app)

export const provider = {
  google: new GoogleAuthProvider()
}

export let analytics: Analytics | undefined = undefined
if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
  analytics = getAnalytics(app)
}
