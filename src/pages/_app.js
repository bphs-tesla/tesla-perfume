import { ChakraProvider, Box } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box minH='100vh' bg='gray.200'>
      <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
