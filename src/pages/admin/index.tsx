import { Button } from "@chakra-ui/react"
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
        {(user) => (
            <>
              <h1>
                管理者ページ ({user.email})
              </h1>
              <div>
                <Button onClick={logout}>ログアウト</Button>
              </div>
              <div>
                <ButtonWithLoading onClick={async () => {
                  const sheet = await createSheet(user.uid)
                  navigate(`/admin/sheet?id=${sheet}`)
                }}>QRコードシートを作成</ButtonWithLoading>
              </div>
            </>
          )}
      </FirebaseAuthProtector>
    </CommonLayout>
  )
}
export default Page