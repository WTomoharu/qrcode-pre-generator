import { ReactElement, ReactNode } from "react"
import { User } from "firebase/auth"
import { useFirebaseAuthContext } from "./firebase-auth"
import { Button, Center, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react"

import { signInWithRedirect } from "firebase/auth"
import { auth, provider } from "../lib/firebase"

export const FirebaseAuthLoading = () => {
  return (
    <Center minH="100vh">
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        boxSize="32"
        size='xl'
      />
    </Center>
  )
}

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

export const FirebaseAuthProtector = (props: { children?: ReactNode | ((user: User) => ReactElement) }) => {
  const { user } = useFirebaseAuthContext()

  if (user === undefined) {
    return (
      <FirebaseAuthLoading />
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
