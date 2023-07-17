import { ReactNode } from "react"
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"

type CommonStaticModalProps = {
  title: string
  children: ReactNode
}

export const CommonStaticModal = (props: CommonStaticModalProps) => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={true} isCentered onClose={() => { }}>
      <ModalOverlay />
      <ModalContent m="2">
        <ModalHeader>
          {props.title}
        </ModalHeader>
        <ModalBody pb={6}>
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}