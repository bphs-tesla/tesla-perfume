import Head from 'next/head'
import Link from 'next/link'
import { Container, Heading, Spinner, Card, Stack, CardBody, CardFooter, Text, Divider } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { scents, capcity } from '@/utils/Constants'



export default function Create({ query }) {
  const [ data, setData ] = useState(null)
  useEffect(() => {
    fetch(`/api/create?mbti=${query.mbti}&feeling=${query.feeling}&nonce=${query.nonce}`)
    .then(res =>
      res.json().then(setData)
    )
  }, [])
  return (
    <Container>
    <Head>
      <title>향수 제작</title>
    </Head>
    <Container maxW="container.xl" textAlign='center' py='12'>
      <Heading as='h2' size='lg' fontWeight='normal'>
        <Link href='/'>TESLA</Link>
      </Heading>
      <Heading as='h1' size='2xl' fontWeight='semibold'>인공지능 조향기를 이용한 나만의 향수 만들기</Heading>
      {/* <Link href='/'>Main</Link> */}
      
      </Container>
      { data ?
        <>
          <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline'>
          <Stack>
            <CardBody>
              <Heading size='xl' fontWeight='thin'>{data.name}</Heading>

              <Text pt={2}>
                {data.description}
              </Text>
            </CardBody>
            <Divider />
            <CardFooter>
              조향 베이스({capcity[0]}ml), {data.result.map(el=> `${scents[el]}(${capcity[1]}ml)`).join(', ')}
            </CardFooter>
          </Stack>
          </Card>
        </> : <Container textAlign='center'>
          <Spinner /> 
          </Container>
      }
    
  </Container>
  )
}

export function getServerSideProps(context) {
  return { props: { query: context.query } }
}
