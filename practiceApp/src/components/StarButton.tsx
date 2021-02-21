import { StarIcon } from '@chakra-ui/icons'
import { Button, Flex, Text } from '@chakra-ui/react'

import type { Edges } from '@/pages/index'

type Props = Pick<Edges, 'node'>

// eslint-disable-next-line react/destructuring-assignment
const StarButton = ({ node }: Props) => {
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text>{totalCount}</Text>
      <Button leftIcon={<StarIcon />} colorScheme="yellow" variant="solid" ml={5} color="gray">
        {viewerHasStarred ? 'removestar' : 'addstar'}
      </Button>
    </Flex>
  )
}

// eslint-disable-next-line import/no-default-export
export default StarButton
