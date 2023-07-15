import { signInWithRedirect, signOut } from "firebase/auth"
import { useFirebaseAuthContext } from "../hook/firebase-auth"
import { auth, provider } from "../lib/firebase"

export const Page = () => {
  const { user } = useFirebaseAuthContext()

  const onClickLoginButton = () => {
    signInWithRedirect(auth, provider.google)
  }

  const onClickLogoutButton = () => {
    signOut(auth)
  }

  return (
    <>
      <h1>Admin</h1>
      <p>認証状態： {user === undefined ? "認証中" : user === null ? "未認証" : user.email + "で認証を完了"}</p>
      <button onClick={onClickLoginButton}>login</button><br />
      <button onClick={onClickLogoutButton}>logout</button><br />
    </>
  )
}
export default Page