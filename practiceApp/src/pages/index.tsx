import { useQuery } from '@apollo/client'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, Box, Button, Flex, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import { RepositoryTable } from '@/components'
import { SEARCH_REPOSITORIES } from '@/graphql/query'

export type Variables = {
  after: string | null
  before: string | null
  first: number | null
  last: number | null
}

export type PageInfo = {
  endCursor: string
  startCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  __pageInfo: string
}

export type Edges = {
  cursor: string
  node: {
    id: string
    name: string
    url: string
    __typename: string
    stargazers: {
      totalCount: string
    }
    viewerHasStarred: boolean
  }
  __typename: string
}

const DEFAULT_STATE: Variables = {
  after: null,
  before: null,
  first: 5,
  last: null,
}

const DEFAULT_PAGE_INFO: PageInfo = {
  endCursor: '',
  startCursor: '',
  hasNextPage: false,
  hasPreviousPage: false,
  __pageInfo: '',
}

const Home = () => {
  const [title, setTitle] = useState<string>('')
  const [edges, setEdes] = useState<Edges[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo>(DEFAULT_PAGE_INFO)
  const [variables, setVariables] = useState<Variables>(DEFAULT_STATE)
  const [searchWord, setSearchWord] = useState('')
  const searchWordRef = useRef({} as HTMLInputElement)

  const searchRepository = useQuery(SEARCH_REPOSITORIES, {
    variables: { ...variables, query: searchWord },
  })

  const queryHandler = ({ loading, error, data }: any): void => {
    if (loading) return setTitle(title)
    if (error) return setTitle(`Error!! ${error.message}`)

    // eslint-disable-next-line no-console
    console.log(data)

    setPageInfo(data.search.pageInfo)
    setEdes(data.search.edges)
    setTitle(data.search.repositoryCount)
  }

  const handleClick = () => {
    setSearchWord(searchWordRef.current.value)
  }

  const goPrevious = () => {
    setVariables({
      last: 5,
      before: pageInfo.startCursor,
      first: null,
      after: null,
    })
  }

  const goNext = () => {
    setVariables({
      first: 5,
      after: pageInfo.endCursor,
      last: null,
      before: null,
    })
  }

  useEffect(() => {
    queryHandler(searchRepository)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord, searchRepository])

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
          p={3}
          my="5"
          color="#606060"
          fontWeight="bold"
          textAlign="center"
          fontSize="1.3rem"
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
          mb="7"
          ref={searchWordRef}
        />
        <Button
          colorScheme="blue"
          mx="auto"
          mb="7"
          w="30%"
          onClick={() => {
            handleClick()
          }}
        >
          Search!
        </Button>
        <>
          <Alert status="success" fontWeight="bold">
            <AlertIcon />
            {`GitHub Repositories Search Result: ${title} Repositories!`}
          </Alert>

          <RepositoryTable edges={edges} variables={{ query: searchWord, ...variables }} />

          <Flex mt={10} justifyContent="center">
            {pageInfo?.hasPreviousPage ? (
              <Button
                leftIcon={<ArrowBackIcon />}
                colorScheme="teal"
                onClick={() => {
                  goPrevious()
                }}
              >
                Previous
              </Button>
            ) : (
              <Box w="80px"></Box>
            )}
            {pageInfo?.hasNextPage && (
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="teal"
                ml={5}
                onClick={() => {
                  goNext()
                }}
              >
                Next
              </Button>
            )}
          </Flex>
        </>
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
