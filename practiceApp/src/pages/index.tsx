import { useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Button, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'

import { SEARCH_REPOSITORIES } from '@/graphql/query'

type Variables = {
  after: string | null
  before: string | null
  first: number | null
  last: number | null
}

const DEFAULT_STATE: Variables = {
  after: null,
  before: null,
  first: 5,
  last: null,
}

const Home = () => {
  const [queryResult, setQueryResult] = useState<string>('')
  const [searchWord, setSearchWord] = useState('')
  const { first, last, before, after } = DEFAULT_STATE

  const qlQuery = useQuery(SEARCH_REPOSITORIES, {
    variables: { query: searchWord, first, last, before, after },
  })

  const handleClick = ({ loading, error, data }: any): string => {
    if (loading) return 'loading...'
    if (error) return `Error!! ${error.message}`

    // eslint-disable-next-line no-console
    console.log(data.search)
    return data.search.repositoryCount
  }

  const inputSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
  }

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
          onChange={(e) => {
            inputSearchWord(e)
          }}
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
        {queryResult === '' || isNaN(Number(queryResult)) ? (
          <div>Please Insert word</div>
        ) : (
          <Alert status="success" fontWeight="bold">
            <AlertIcon />
            {`GitHub Repositories Search Result: ${queryResult} Repositories!`}
          </Alert>
        )}
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
