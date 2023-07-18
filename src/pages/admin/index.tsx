import { Heading, Text } from "@chakra-ui/react"
import { signOut } from "firebase/auth"
import { FirebaseAuthProtector } from "../../hook/firebase-auth-protector"
import { auth } from "../../lib/firebase"
import { collection } from "firebase/firestore"
import { addDocSafely, firestore } from "../../lib/firestore"
import { range } from "../../lib/utils"
import { useNavigate } from "react-router-dom"
import { ButtonWithLoading } from "../../component/button-with-loading"
import { CommonLayout } from "../../component/common-layout"

async function logout() {
  return signOut(auth).catch(console.error)
}

async function createSheet(uid: string) {
  const sheet = await addDocSafely(collection(firestore, "/sheets"), {
    uid,
  })

  const qrcodes = await Promise.all(range(5).map(() => {
    return addDocSafely(collection(firestore, "/qrcodes"), {
      uid,
      sheet: sheet.id,
      url: null
    })
  }))

  console.log("sheet: ", sheet)
  console.log("qrcodes: ", qrcodes.map(qrcode => qrcode.id).join(", "))

  return sheet.id
}

export const Page = () => {
  const navigate = useNavigate()

  return (
    <CommonLayout>
      <FirebaseAuthProtector>
        {user => (
          <>
            <Heading
              fontSize="2xl"
              textAlign="center"
              py="2"
            >
              管理者ページ
            </Heading>
            <Text
              textAlign="center"
              pb="4"
            >
              {user.email}でログイン中
            </Text>
            <ButtonWithLoading
              width="full"
              m="2"
              onClick={async () => {
                const sheet = await createSheet(user.uid)
                navigate(`/admin/sheet?id=${sheet}`)
              }}
            >
              QRコードシートを作成
            </ButtonWithLoading>
            <ButtonWithLoading
              width="full"
              m="2"
              onClick={() => logout()}
            >
              ログアウト
            </ButtonWithLoading>
          </>
        )}
      </FirebaseAuthProtector>
    </CommonLayout>
  )
}
export default Page