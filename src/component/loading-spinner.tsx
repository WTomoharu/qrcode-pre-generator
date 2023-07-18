import { Center, Spinner, Text } from "@chakra-ui/react"

export const LoadingSpinner = (props: { text?: string }) => {
  return (
    <Center flexGrow="1" flexDir="column">
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        boxSize="32"
        size='xl'
      />
      {props.text && (
        <Text fontSize="4xl" my="8" maxWidth="400px" textAlign="center">
          {props.text}
        </Text>
      )}
    </Center>
  )
}