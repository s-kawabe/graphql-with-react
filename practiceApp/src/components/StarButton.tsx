import { useMutation } from '@apollo/client'
import { StarIcon } from '@chakra-ui/icons'
import { Button, Flex, Text } from '@chakra-ui/react'

import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from '@/graphql/query'
import type { Edges, Variables } from '@/pages/index'

type Props = {
  node: Edges['node']
  variables: Variables & { query: string }
}

// eslint-disable-next-line react/destructuring-assignment
const StarButton = ({ node, variables }: Props) => {
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred

  const STAR_MUTATE = viewerHasStarred ? REMOVE_STAR : ADD_STAR

  // useMutationは戻り値にmutate関数を返す
  // refetchQueryオプションの指定により、mutation後にstarの総数を再取得して
  // 非同期処理のような動きが再現可能
  const [changeStar] = useMutation(STAR_MUTATE, {
    variables: { input: { starrableId: node.id } },
    refetchQueries: [{ query: SEARCH_REPOSITORIES, variables: { ...variables } }],
  })

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text>{totalCount}</Text>
      <Button
        leftIcon={<StarIcon />}
        colorScheme="yellow"
        variant="solid"
        ml={5}
        color="gray"
        onClick={() => {
          changeStar()
        }}
      >
        {viewerHasStarred ? 'removestar' : 'addstar'}
      </Button>
    </Flex>
  )
}

// eslint-disable-next-line import/no-default-export
export default StarButton
