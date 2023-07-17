import { ReactNode } from "react"
import { User } from "firebase/auth"
import { useFirebaseAuthContext } from "./firebase-auth"
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"

import { signInWithRedirect } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import { LoadingSpinner } from "../component/loading-spinner"

export const FirebaseAuthLoginPopup = () => {
  const onClickLoginButton = () => {
    signInWithRedirect(auth, provider.google)
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={true} isCentered onClose={console.log}>
        <ModalOverlay />
        <ModalContent m="2">
          <ModalHeader>
            ログイン画面
          </ModalHeader>
          <ModalBody pb={6}>
            <Text mb="4">
              このページを表示するにはログインが必要です
            </Text>
            <Button
              onClick={onClickLoginButton}
              width="full"
            >
              sign in with google
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
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
