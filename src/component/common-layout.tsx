import { ReactNode } from "react"
import { Box, Text } from "@chakra-ui/react"
import { css } from "@emotion/react"

export const CommonLayout = (props: { children?: ReactNode }) => {
  return (
    <>
      <Box as="header" bg="green.600" css={css`
        @media print{
          display: none;
        }
      `}>
        <Text
          fontSize="2xl"
          color="white"
          textAlign="center"
          py="2"

        >
          QRCode Pre-Generator
        </Text>
      </Box>
      <Box as="main" px="4" flexGrow="1" display="flex" flexDir="column">
        {props.children}
      </Box>
    </>
  )
}