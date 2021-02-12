import { Box, Button, Input } from '@chakra-ui/react'
import gql from 'graphql-tag'
import Head from 'next/head'
import { Query } from 'react-apollo'

const USER = gql`
  query USER {
    user(login: "s-kawabe") {
      name
      bio
    }
  }
`

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
        <Input placeholder="insert your github id!" size="lg" mx="auto" w="30vw" mb="10" />
        <Button
          colorScheme="blue"
          mx="auto"
          mb="20"
          w="30vw"
          onClick={() => {
            window.alert('hello graphql')
          }}
        >
          Search!
        </Button>
        {
          <Query query={USER}>
            {({ loading, error, data }: any) => {
              if (loading) return 'loading...'
              if (error) return `Error!! ${error.message}`

              return <div>{data.user.bio}</div>
            }}
          </Query>
        }
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
