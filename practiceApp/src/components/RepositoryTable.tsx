import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import styled from '@emotion/styled'

import type { Edges } from '@/pages/index'

const LinkColoring = styled.a`
  font-size: 1.4rem;
  color: #22aaaa;
  &:hover {
    color: #33dddd;
  }
`

type Props = {
  edges: Edges
}

// eslint-disable-next-line react/destructuring-assignment
const RepositoryTable: React.FC<Props> = (props) => {
  // eslint-disable-next-line no-console
  console.log(props)
  return (
    <Table variant="striped" colorScheme="teal.100">
      <TableCaption>Search by GitHub</TableCaption>
      <Thead>
        <Tr>
          <Th w="70%">RepositoryName</Th>
          <Th w="30%">star</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/*  eslint-disable-next-line react/prop-types */}
        {props.edges.map((edge) => {
          return (
            <Tr key={edge.node.id}>
              <Td>
                <LinkColoring href={edge.node.url} target="blank">
                  {edge.node.name}
                </LinkColoring>
              </Td>
              <Td>hoge</Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

// eslint-disable-next-line import/no-default-export
export default RepositoryTable
