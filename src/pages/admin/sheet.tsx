import { css, Global } from "@emotion/react"
import { Box, Button, Center, SimpleGrid, Text } from "@chakra-ui/react"

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
  return (
    <>
      <FirebaseAuthProtector>
        {() => (
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
              <Button onClick={() => {
                window.print()
              }}>
                印刷
              </Button>
            </Box>
          </>
        )}
      </FirebaseAuthProtector>
    </>
  )
}
export default Page