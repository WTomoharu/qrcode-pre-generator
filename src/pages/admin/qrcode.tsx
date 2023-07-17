import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import useSWR from "swr"

import { FirebaseAuthProtector } from "../../hook/firebase-auth-protector"
import { useNavigate, useSearchParams } from "react-router-dom"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { qrcodeCollection } from "../../lib/firestore"
import { CommonStaticModal } from "../../component/common-modal"
import { QRCode } from "../../lib/types"
import { useState } from "react"
import { ButtonWithLoading } from "../../component/button-with-loading"
import { minTime } from "../../lib/utils"

type QRCodeEditorModalProps = {
  qrcode: QRCode,
  onSubmit?: (data: { url: string | null }) => Promise<void> | void
}

const QRCodeEditorModal = (props: QRCodeEditorModalProps) => {
  const [url, setUrl] = useState(props.qrcode.url ?? "")

  return (
    <Modal
      isOpen={true}
      onClose={() => { }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          QRコードの編集
        </ModalHeader>
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>URL</FormLabel>
            <Input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder='リンク先のURL'
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <ButtonWithLoading colorScheme='blue' mr={3} onClick={() => {
            return props.onSubmit?.({ url })
          }}>
            変更する
          </ButtonWithLoading>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )

}

const QRCodeEditorPage = (props: { uid: string, qrcode: string }) => {
  const navigate = useNavigate()

  const qrcodeRef = doc(qrcodeCollection, props.qrcode)

  const { data: qrcodeSnapshot } = useSWR(qrcodeRef.path, () => {
    return getDoc(qrcodeRef)
  }, { suspense: true })

  const qrcodeData = qrcodeSnapshot.data()

  if (!qrcodeData) {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          指定されたQRコードは存在しません。
        </Text>
        <Button
          onClick={() => {
            navigate("/")
          }}
          width="full"
        >
          トップページに戻る
        </Button>
      </CommonStaticModal>
    )
  } else if (qrcodeData.uid !== props.uid) {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          このQRコードを編集する権限がありません
        </Text>
        <Button
          onClick={() => {
            navigate("/")
          }}
          width="full"
        >
          トップページに戻る
        </Button>
      </CommonStaticModal>
    )
  } else {
    return (
      <QRCodeEditorModal
        qrcode={qrcodeData} 
        onSubmit={(data) => {
          return minTime(updateDoc(qrcodeRef, {
            url: data.url ? data.url : null
          }), 500).then(() => {
            navigate("/admin")
          }).catch(err => {
            console.error(err)
          })
        }}
      />
    )
  }
}

export const AdminQRCodePage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const qrcodeId = params.get("id")

  if (!qrcodeId) {
    navigate("/admin")
    return
  }

  return (
    <>
      <FirebaseAuthProtector>
        {user => (
          <QRCodeEditorPage uid={user.uid} qrcode={qrcodeId} />
        )}
      </FirebaseAuthProtector>
    </>
  )
}
export default AdminQRCodePage