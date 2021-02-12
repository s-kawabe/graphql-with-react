import { useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Button, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'

import { RepositoryTable } from '@/components'
import { SEARCH_REPOSITORIES } from '@/graphql/query'

type Variables = {
  after: string | null
  before: string | null
  first: number | null
  last: number | null
}

export type Edges = {
  cursor: string
  node: {
    id: string
    name: string
    url: string
    __typename: string
  }
  __typename: string
}[]

const DEFAULT_STATE: Variables = {
  after: null,
  before: null,
  first: 5,
  last: null,
}

const Home = () => {
  const [title, setTitle] = useState<string>('')
  const [edges, setEdes] = useState<Edges>([])
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

    setEdes(data.search.edges)
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
            setTitle(handleClick(qlQuery))
          }}
        >
          Search!
        </Button>
        {title === '' || isNaN(Number(title)) ? (
          <div>Please Insert word</div>
        ) : (
          <>
            <Alert status="success" fontWeight="bold">
              <AlertIcon />
              {`GitHub Repositories Search Result: ${title} Repositories!`}
            </Alert>
            <RepositoryTable edges={edges} />
          </>
        )}
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
