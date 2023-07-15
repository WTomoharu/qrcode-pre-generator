import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from '../lib/firebase';

type AuthContextProps = {
  user: User | null | undefined
}

const FirebaseAuthContext = createContext<AuthContextProps>({ user: undefined })

export const FirebaseAuthProvider = (props: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    onAuthStateChanged(auth, user => setUser(user))
  }, [])

  return (
    <FirebaseAuthContext.Provider value={{ user }}>
      {props.children}
    </FirebaseAuthContext.Provider>
  )
}

export const useFirebaseAuthContext = () => {
  return useContext(FirebaseAuthContext)
}