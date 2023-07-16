
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { css, Global } from "@emotion/react"
import { Button, Center, SimpleGrid, Text } from "@chakra-ui/react"

import QRCode from "react-qr-code"

import { FirebaseAuthProtector } from "../../hook/firebase-auth-protector"
import { getRandomId } from "../../lib/id"
import { range } from "../../lib/utils"

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

export const Page = () => {
  const [params, setParams] = useSearchParams()

  const isPrint = params.get("media") === "print"

  useEffect(() => {
    if (isPrint) {
      window.print()
      params.delete("media")
      setParams(params)
    }
  }, [isPrint])

  return (
    <>
      <FirebaseAuthProtector>
        {isPrint ? (
          <SheetPrintView />

        ) : (
          <div>
            <Button onClick={() => {
              params.set("media", "print")
              setParams(params)
            }}>
              印刷
            </Button>
          </div>
        )}
      </FirebaseAuthProtector>
    </>
  )
}
export default Page