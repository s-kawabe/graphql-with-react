import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

// 最初に作成した環境変数を読み込む
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

const headersLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  })
  return forward(operation)
})

const endpoint = 'https://api.github.com/graphql'
const httpLink = new HttpLink({ uri: endpoint })
// ApolloLinkとHttpLinkを結合する
const link = ApolloLink.from([headersLink, httpLink])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
