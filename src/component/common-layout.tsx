import { ReactNode } from "react"
import { Box } from "@chakra-ui/react"

export const CommonLayout = (props: { children?: ReactNode }) => {
  return (
    <Box
      bg="gray.200"
    >
      <Box
        maxW={{ base: undefined, md: 440 }}
        minH="100vh"
        bg="white"
        margin="0 auto"
        px="4"
      >
        {props.children}
      </Box>
    </Box>
  )
}