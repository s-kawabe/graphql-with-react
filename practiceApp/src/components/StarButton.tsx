import { useMutation } from '@apollo/client'
import { StarIcon } from '@chakra-ui/icons'
import { Button, Flex, Text } from '@chakra-ui/react'

import { ADD_STAR } from '@/graphql/query'
import type { Edges } from '@/pages/index'

type Props = Pick<Edges, 'node'>

// eslint-disable-next-line react/destructuring-assignment
const StarButton = ({ node }: Props) => {
  // useMutationは戻り値にmutate関数を返す
  const [addStar] = useMutation(ADD_STAR, {
    variables: { input: { starrableId: node.id } },
  })

  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
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
          addStar()
        }}
      >
        {viewerHasStarred ? 'removestar' : 'addstar'}
      </Button>
    </Flex>
  )
}

// eslint-disable-next-line import/no-default-export
export default StarButton
