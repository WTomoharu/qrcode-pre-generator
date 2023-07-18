import { css, Global } from "@emotion/react"
import { Box, Button, Center, Heading, Link, SimpleGrid, Text } from "@chakra-ui/react"
import useSWR from "swr"

import QRCode from "react-qr-code"

import { FirebaseAuthProtector } from "../../hook/firebase-auth-protector"
import { getRandomId } from "../../lib/id"
import { range } from "../../lib/utils"
import { Link as ReactLink, useNavigate, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { sheetCollection } from "../../lib/firestore"
import { CommonLayout } from "../../component/common-layout"
import { useEffect } from "react"
import { CommonStaticModal } from "../../component/common-modal"

const SheetPrintView = () => {
  return (
    <div>
      <Global styles={css`
        @page {
          size: A4 portrait; //横の場合はlandscape
        }   
      `} />
      <SimpleGrid
        width="100vw"
        height="100vh"
        maxWidth="210mm"
        maxHeight="297mm"
        margin="0 auto"
        row={12}
        columns={2}
      >
        {range(10 * 2).map(() => getRandomId()).map(id => (
          <Center w="100%" h="100%" padding="4" key={id}>
            <QRCode
              size={48}
              value={"https://qrcode-pre-generator.web.app?id=" + id}
              css={css`
                height: 100%;
                width: auto;
              `}
            />
            <Text
              flexGrow="1"
              mx="4"
            >
              QRコードより<br />
              サイトにアクセスできます
            </Text>
          </Center>
        ))}
      </SimpleGrid>
    </div>
  )
}

const SheetInfomationPage = (props: { uid: string, sheet: string }) => {
  const sheetRef = doc(sheetCollection, props.sheet)

  const { data: sheetSnapshot } = useSWR(sheetRef.path, () => {
    return getDoc(sheetRef)
  }, { suspense: true })

  const sheetData = sheetSnapshot.data()

  if (!sheetData) {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          指定されたシートは存在しません。
        </Text>
        <Link as={ReactLink} to="/admin">
          <Button width="full" m="2">
            トップページに戻る
          </Button>
        </Link>
      </CommonStaticModal>
    )
  } else if (sheetData.uid !== props.uid) {
    return (
      <CommonStaticModal title="エラー">
        <Text mb="4">
          このシートを操作する権限がありません
        </Text>
        <Link as={ReactLink} to="/admin">
          <Button width="full" m="2">
            トップページに戻る
          </Button>
        </Link>
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
          シート管理ページ
        </Heading>
        <Text
          textAlign="center"
          pb="4"
        >
          (Sheet ID: {props.sheet})
        </Text>
        <Button
          width="full"
          onClick={() => {
            window.print()
          }}
        >
          シートを印刷
        </Button>
      </>
    )
  }
}

export const Page = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const sheetId = params.get("id")

  if (!sheetId) {
    useEffect(() => {
      navigate("/admin")
    }, [])
    return null
  }

  return (
    <CommonLayout>
      <FirebaseAuthProtector>
        {user => (
          <>
            <Box css={css`
              display: none;

              @media print{
                display: block
              }
            `}>
              <SheetPrintView />
            </Box>
            <Box css={css`
              display: block;

              @media print{
                display: none;
              }
            `}>
              <SheetInfomationPage
                uid={user.uid}
                sheet={sheetId}
              />
            </Box>
          </>
        )}
      </FirebaseAuthProtector>
    </CommonLayout>
  )
}
export default Page