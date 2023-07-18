import { ReactNode } from "react"
import { Box, Text } from "@chakra-ui/react"

export const CommonLayout = (props: { children?: ReactNode }) => {
  return (
    <>
      <Box as="header" bg="green.600">
        <Text
          fontSize="2xl"
          color="white"
          textAlign="center"
          py="2"

        >
          Qrcode Pre-Generator
        </Text>
      </Box>
      <Box as="main" px="4">
        {props.children}
      </Box>
    </>
  )
}