import { useQuery } from '@apollo/client'
import { Box, Button, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'

import { SEARCH_REPOSITORIES } from '@/graphql/query'

type Variables = {
  after: string | null
  before: string | null
  first: number | null
  last: number | null
  query: string
}

const VARIABLES: Variables = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: 'フロントエンドエンジニア',
}

const Home = () => {
  const [queryResult, setQueryResult] = useState('')
  // const [query, setQuery] = useState('')
  // const [variables, setVariables] = useState<Variables>(VARIABLES)
  const { query, first, last, before, after } = VARIABLES

  const qlQuery = useQuery(SEARCH_REPOSITORIES, {
    variables: { query, first, last, before, after },
  })

  const handleClick = ({ loading, error, data }: any) => {
    if (loading) return 'loading...'
    if (error) return `Error!! ${error.message}`

    // eslint-disable-next-line no-console
    console.log(data)
    return ''
  }

  // const inputId = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setId(e.target.value)
  // }

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
        <Input
          placeholder="insert concern repository name!"
          size="lg"
          mx="auto"
          w="30vw"
          mb="10"
          // onChange={(e) => {
          //   inputId(e)
          // }}
        />
        <Button
          colorScheme="blue"
          mx="auto"
          mb="20"
          w="30vw"
          onClick={() => {
            setQueryResult(handleClick(qlQuery))
          }}
        >
          Search!
        </Button>
        <div>{queryResult}</div>
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
