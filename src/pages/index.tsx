import { Button, Heading, Link, Text } from "@chakra-ui/react"
import { doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"
import { Link as ReactLink, useNavigate, useSearchParams } from "react-router-dom"
import useSWR from "swr"
import { CommonLayout } from "../component/common-layout"
import { CommonStaticModal } from "../component/common-modal"
import { qrcodeCollection } from "../lib/firestore"

export const QRCodeRedirectPage = (props: { id: string }) => {
  const navigate = useNavigate()

  const qrcodeRef = doc(qrcodeCollection, props.id)

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
  } else if (!qrcodeData.url) {
    useEffect(() => {
      navigate("/admin/qrcode?id=" + props.id + "&mode=edit_url")
    }, [])
    return null
  } else {
    location.href = qrcodeData.url
    return null
  }
}
export const IndexPage = () => {
  const [params] = useSearchParams()
  const id = params.get("id")

  return (
    <CommonLayout>
      {id ? (
        <QRCodeRedirectPage id={id} />
      ) : (
        <>
          <Heading
            fontSize="2xl"
            textAlign="center"
            py="2"
          >
            Top Page
          </Heading>
          <Link as={ReactLink} to="/admin">
            <Button width="full" m="2">
              管理者画面
            </Button>
          </Link>
          <Button width="full" m="2" disabled>
            IDからリンク先に行く
          </Button>
        </>
      )}
    </CommonLayout>
  )
}

export default IndexPage