import { signOut } from "firebase/auth"
import { FirebaseAuthProtector } from "../hook/firebase-auth-protector"
import { auth } from "../lib/firebase"

export const Page = () => {
  const onClickLogoutButton = () => {
    signOut(auth)
  }

  return (
    <>
      <FirebaseAuthProtector>
        {(user) => (
            <>
              <h1>Admin</h1>
              <h1>{user.email}</h1>
              <button onClick={onClickLogoutButton}>logout</button><br />  
            </>
          )}
      </FirebaseAuthProtector>
    </>
  )
}
export default Page