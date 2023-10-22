import Head from 'next/head'
import Link from 'next/link'
import { Container, Heading, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { scents } from '@/utils/Constants'



export default function Create({ query }) {
  const [ data, setData ] = useState(null)
  useEffect(() => {
    fetch(`/api/create?mbti=${query.mbti}&feeling=${query.feeling}&nonce=${query.nonce}`)
    .then(res =>
      res.json().then(setData)
    )
  }, [])
  return (
    <>
      <Head>
        <title>향수 제작</title>
      </Head>
      <Container maxW="container.xl" textAlign='center' py='12'>
        <Heading as='h2' size='lg'>TESLA</Heading>
        <Heading as='h1' size='2xl'>인공지능 조향기를 이용한 나만의 향수 만들기</Heading>
        <Link href='/'>Main</Link>
        { data ?
          <>
            <Heading size='md' my={4}>향수 이름: {data.name}</Heading>
            <Heading size='md' my={4}>향수 설명: {data.description}</Heading>
            <Heading size='md' my={4}>향료: {data.result.map(item => scents[item] )}</Heading>
          </> : <Spinner />
        }
      </Container>
    </>
  )
}

export function getServerSideProps(context) {
  return { props: { query: context.query } }
}
