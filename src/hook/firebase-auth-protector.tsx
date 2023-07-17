import { ReactNode } from "react"
import { User } from "firebase/auth"
import { useFirebaseAuthContext } from "./firebase-auth"
import { Button, Text } from "@chakra-ui/react"

import { signInWithRedirect } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import { LoadingSpinner } from "../component/loading-spinner"
import { CommonStaticModal } from "../component/common-modal"

export const FirebaseAuthLoginPopup = () => {
  const onClickLoginButton = () => {
    signInWithRedirect(auth, provider.google)
  }

  return (
    <CommonStaticModal title="ログイン画面">
      <Text mb="4">
        このページを表示するにはログインが必要です
      </Text>
      <Button
        onClick={onClickLoginButton}
        width="full"
      >
        sign in with google
      </Button>
    </CommonStaticModal>
  )
}

export const FirebaseAuthProtector = (props: { children?: ReactNode | ((user: User) => ReactNode) }) => {
  const { user } = useFirebaseAuthContext()

  if (user === undefined) {
    return (
      <LoadingSpinner text="auth" />
    )
  } else if (user === null) {
    return (
      <FirebaseAuthLoginPopup />
    )
  } else {
    if (typeof props.children === "function") {
      return (
        <>{props.children(user)}</>
      )
    } else {
      return (
        <>{props.children}</>
      )
    }
  }
}
