import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import styled from '@emotion/styled'

import StarButton from '@/components/StarButton'
import type { Edges, Variables } from '@/pages/index'

const LinkColoring = styled.a`
  font-size: 1.4rem;
  color: #22aaaa;
  &:hover {
    color: #33dddd;
  }
`

type Props = {
  edges: Edges[]
  variables: Variables & { query: string }
}

// eslint-disable-next-line react/destructuring-assignment
const RepositoryTable: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Table variant="striped" colorScheme="teal.100">
        <Thead>
          <Tr>
            <Th w="75%">RepositoryName</Th>
            <Th w="25%">star</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/*  eslint-disable-next-line react/prop-types */}
          {props.edges.map((edge) => {
            return (
              <Tr key={edge.node.id}>
                <Td>
                  <LinkColoring href={edge.node.url} target="blank" rel="noopener noreferrer">
                    {edge.node.name}
                  </LinkColoring>
                </Td>
                <Td>
                  <StarButton node={edge.node} variables={props.variables} />
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default RepositoryTable
