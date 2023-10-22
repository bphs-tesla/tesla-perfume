import Head from 'next/head'
import Link from 'next/link'
import { Container, Heading, TableContainer, Table, Tbody, Thead, Tr, Th, Td } from '@chakra-ui/react'
import Knex from '@/utils/Knex'


export default function Admin({ data }) {
  return (
    <>
      <Head>
        <title>관리자 페이지</title>
      </Head>
      <Container maxW="container.xl" textAlign='center' py='12'>
        <Heading as='h2' size='lg'>TESLA</Heading>
        <Heading as='h1' size='2xl'>관리자 페이지</Heading>
        <Link href='/'>Main</Link>
        <TableContainer bg='white' mt={10} rounded='2xl'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>name</Th>
                <Th>used</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(item => 
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.count}</Td>
              </Tr>)
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const data = await Knex('perfume')
  return { props: { data } }
}