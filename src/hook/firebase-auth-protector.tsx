import { ReactNode } from "react"
import { signInAnonymously, User } from "firebase/auth"
import { useFirebaseAuthContext } from "./firebase-auth"
import { Button, Text } from "@chakra-ui/react"

import { signInWithRedirect } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import { LoadingSpinner } from "../component/loading-spinner"
import { CommonStaticModal } from "../component/common-modal"

export const FirebaseAuthLoginPopup = () => {
  const onClickGoogleLoginButton = () => {
    signInWithRedirect(auth, provider.google)
  }

  const onClickAnonymousLoginButton = () => {
    signInAnonymously(auth)
  }

  return (
    <CommonStaticModal title="ログイン画面">
      <Text mb="4">
        このページを表示するにはログインが必要です
      </Text>
      <Button
        width="full"
        mb="4"
        onClick={onClickGoogleLoginButton}
      >
        Googleアカウントでログイン
      </Button>
      <Button
        width="full"
        onClick={onClickAnonymousLoginButton}
      >
        ゲストとしてログイン
      </Button>
    </CommonStaticModal>
  )
}

type FirebaseAuthProtectorProps = {
  children: ReactNode | ((user: User) => ReactNode)
  form?: ReactNode | (() => ReactNode)
}

export const FirebaseAuthProtector = (props: FirebaseAuthProtectorProps) => {
  const { user } = useFirebaseAuthContext()

  if (user === undefined) {
    return (
      <LoadingSpinner text="auth" />
    )
  } else if (user === null) {
    if (!props.form) {
      return (
        <>
          {props.form}
        </>
      )
    } else {
      return (
        <FirebaseAuthLoginPopup />
      )
    }
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
