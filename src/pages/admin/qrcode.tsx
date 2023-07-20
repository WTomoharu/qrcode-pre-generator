import { Button, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import useSWR from "swr"

import { FirebaseAuthLoginPopup, FirebaseAuthProtector } from "../../hook/firebase-auth-protector"
import { useNavigate, useSearchParams } from "react-router-dom"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { qrcodeCollection } from "../../lib/firestore"
import { CommonStaticModal } from "../../component/common-modal"
import { QRCode } from "../../lib/types"
import { useEffect, useState } from "react"
import { ButtonWithLoading } from "../../component/button-with-loading"
import { minTime } from "../../lib/utils"
import { CommonLayout } from "../../component/common-layout"

type QRCodeBaseEditorModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  text?: string
  button: string
  qrcode: QRCode,
  onSubmit?: (data: { url: string | null }) => Promise<void> | void
}

const QRCodeBaseEditorModal = (props: QRCodeBaseEditorModalProps) => {
  const [url, setUrl] = useState(props.qrcode.url ?? "")

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.title}
        </ModalHeader>
        <ModalBody pb={6}>
          {props.text && (
            <Text>
              {props.text}
            </Text>
          )}
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
            return Promise.resolve(props.onSubmit?.({ url })).then(async () => {
              props.onClose()
            })
          }}>
            {props.button}
          </ButtonWithLoading>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const QRCodeEditorPage = (props: { uid: string, qrcode: string, mode?: string }) => {
  const [isOpenSetterModal, setIsOpenSetterModal] = useState(props.mode === "edit_url")
  const [isOpenEditorModal, setIsOpenEditorModal] = useState(false)

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
  } else if (qrcodeData.uid !== props.uid && !qrcodeData.url) {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          このQRコードはURLが設定されておりません。
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
      <>
        <Heading
          fontSize="2xl"
          textAlign="center"
          py="2"
        >
          QRコード管理ページ
        </Heading>
        <Text
          textAlign="center"
          pb="4"
        >
          (QRCode ID: {props.qrcode})
        </Text>
        <Button
          width="full"
          onClick={() => {
            setIsOpenEditorModal(true)
          }}
        >
          QRコードのリンクURLを編集
        </Button>
        <QRCodeBaseEditorModal
          isOpen={isOpenSetterModal && !qrcodeData.url}
          onClose={() => setIsOpenSetterModal(false)}
          title={"QRコードのリンクURLを設定"}
          text={"このリンクには、リンクURLが設定されていません。"}
          button={"設定する"}
          qrcode={qrcodeData}
          onSubmit={(data) => {
            return minTime(updateDoc(qrcodeRef, {
              url: data.url ? data.url : null
            }), 500).catch(err => {
              console.error(err)
            })
          }}
        />
        <QRCodeBaseEditorModal
          isOpen={isOpenEditorModal}
          onClose={() => setIsOpenEditorModal(false)}
          title={"QRコードのリンクURLを編集"}
          button={"保存する"}
          qrcode={qrcodeData}
          onSubmit={(data) => {
            return minTime(updateDoc(qrcodeRef, {
              url: data.url ? data.url : null
            }), 500).catch(err => {
              console.error(err)
            })
          }}
        />
      </>
    )
  }
}

const QRCodeAuthForm = (props: { qrcode?: QRCode, mode?: string }) => {
  const navigate = useNavigate()
  const [isOpenLoginPopup] = useState(false)

  if (isOpenLoginPopup) {
    return (
      <FirebaseAuthLoginPopup />
    )
  } else if (!props.qrcode) {
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
  } else if (!props.qrcode.url && props.mode === "edit_url") {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          このQRコードはURLが設定されておりません。
        </Text>
        <Button
          onClick={() => {
            useState(true)
          }}
          width="full"
          mb="2"
        >
          ログインして編集する
        </Button>
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
    return undefined
  }
}


export const AdminQRCodePage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const qrcodeId = params.get("id")

  if (!qrcodeId) {
    useEffect(() => {
      navigate("/admin")
    }, [])
    return null
  }

  const mode = params.get("mode") ?? undefined

  const qrcodeRef = doc(qrcodeCollection, qrcodeId)

  const { data: qrcodeSnapshot } = useSWR(qrcodeRef.path, () => {
    return getDoc(qrcodeRef)
  }, { suspense: true })

  const qrcodeData = qrcodeSnapshot.data()


  return (
    <CommonLayout>
      <FirebaseAuthProtector form={(
        QRCodeAuthForm({ qrcode: qrcodeData, mode })
      )}>
        {user => (
          <QRCodeEditorPage uid={user.uid} qrcode={qrcodeId} mode={mode} />
        )}
      </FirebaseAuthProtector>
    </CommonLayout>
  )
}
export default AdminQRCodePage