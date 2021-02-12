import { Box } from '@chakra-ui/react'
import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w="70vw" display="flex" justifyContent="center" flexDirection="column" mx="auto">
        <Box
          bg="teal.100"
          w="100%"
          p={4}
          my="10"
          color="#606060"
          fontWeight="bold"
          textAlign="center"
          fontSize="1.5rem"
          borderRadius="30px"
          boxShadow="2px 2px 5px 0px rgba(0,0,0,0.25)"
        >
          GitHub Repository Search
        </Box>
        <button
          onClick={() => {
            window.alert('Hello, World!')
          }}
        >
          Button
        </button>
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
