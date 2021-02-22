GraphQL,Apollo,React を使ってリポジトリ検索アプリをつくる<br>
learn of the this movie <br>[【はむ式】フロントエンドエンジニアのための GraphQL with React](https://www.udemy.com/course/graphql-with-react/)

<br>

- practiceApp/
  自分で作成する。TypeScript と ChakraUI を使いながら実施
  <br>

- sampleApp/
  講師の方のリポジトリクローン。

---

<br>

# GitHubToken を取得する

Github の Settings → DevelopperSettings → Personal access tokens
からトークンを取得する。トークンは再発行できない。

# Next.js テンプレートを clone

https://github.com/s-kawabe/nextjs-my-template
ここからテンプレートを clone
yarn をして yarn dev をして動いてるか一応確認する。

---

# 🏃‍♂️はじめに
こちらのアプリはudemyの[こちらの講座](https://www.udemy.com/course/graphql-with-react/)を参考に
以下の技術構成で**ページネーション付きGitHubリポジトリ検索アプリ**を作っていきます。
全て学んだばかりに加え、あまり綺麗なコードではありませんが、何卒ご了承ください...

## 💻技術構成
- TypeScript
- Next.js
- GraphQL
- Apollo Client
- ChakraUI
- Emotion

## 🚨注意
今回、以下の点についてはご説明を省略いたしますのでご理解いただければと思います。

- GitHub Tokenの取得について
- Next.jsの環境構築

# 👨‍💻実装
## 準備
私は自分用にTypeScript,ESLint,Prettierがセッティング済みの
Next.jsテンプレートリポジトリが有りますのでそちらをcloneしました。

## 必要なnpmパッケージをインストール
調べた感じだとパッケージに独自の型定義が存在するため、
型定義ファイル(@types/○○)はこちらでインストールする必要は無いようです。

```
yarn add apollo-boost@0.1.16 graphql@14.0.2 @apollo/react-hooks @apollo/client
```
**apollo-boost** - ApolloClientを使うためのHTTPクライアントやキャッシュに関するものをバンドルしてインストールしてくれる
**graphql** - コンポーネントから使うために必要、apollo-boostはクライアントのサポートのみ
~~**react-apollo** - Reactを使ってGraphQLサーバーからデータフェッチするために必要~~
※講座通りreact-apolloを使ったところuseQueryなどが使えなかった。
 `ApolloProvider`は`@apollo/react-hooks`からimportする。

### 環境変数を登録する
このアプリではGithubのリポジトリを検索しますが
そのためにGitHub Tokenが必要となります。これを環境変数に設定していきたい。

[こちらの記事](https://qiita.com/KZ-taran/items/64cad61096cf45f18c24)を参考にしました。
Next.js version9.4からビルトインで環境変数にサポートしているとのこと。
create-react-appの方はdotenv等が必要なのかもしれません。

``` .env.development.local
NEXT_PUBLIC_GITHUB_TOKEN=[GithubのToken]
```
これをやることによりNext.jsのビルド時に`proccess.env`に値を設定してくれるらしい。
`NEXT_PUBLIC_`というプレフィックスをつけることにより、クライアントサイドでも使えるようになります。
(これが嫌な方は`next.config.js`へ設定することでも実現可能とのことなので調べてみてください。)
NEXT_PUBLIC_GITHUB_TOKENは秘匿情報なので`.env.development.local`へと設定します。
本番環境でも使用するためには`.env.production.local`へ同じ物を設定します。

### GraphQLクライアントのセットアップ
ApolloClientを使っていきます。
インストールした`apollo-boost`の依存モジュールには
- apollo-client
- apollo-cache-inmemory
- apollo-link-http
- apollo-link
- graphql-tag
などが入っているのでこちらも使っていきます。

#### ApolloClientの設定
別ファイルでApolloClientのインスタンスを作成します。
httpLinkの設定と、必須であるキャッシュ(状態管理)の設定を行いプロパティとして渡します。
ApolloLinkのインスタンス生成をし、その引数にGitHubのTokenを設定していきます。
これによってGraphQLへのリクエストヘッダーにGitHubのTokenが含まれるようになり
GitHubのGraphQLAPIが使用可能となる仕組みです。
また、GraphQLエンドポイントの指定も行っていきます。

```client.ts
import { ApolloClient, InMemoryCache } from 'apollo-boost'
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
```
**メモ**
※ApolloClientとInMemoryCacheは`apollo-boost`からimportするように変更
※「Property 'setLink' is Missing... 」のようなエラーが出たので[こちらの質問](https://stackoverflow.com/questions/63005568/property-setlink-is-missing-in-type-apolloclientnormalizedcacheobject-but)を参考に型定義ファイルを修正して解決。

#### ApolloProviderの設定
ApolloProviderコンポーネントでApolloを使用するコンポーネントをラッピングします。
先ほど作成したclientをpropsに渡します。
この手法はReduxやMeterialUIなどでも存在していますね。
EmotionでCSSリセットとグローバルスタイルを当てています。

```_app.tsx
import { ApolloProvider } from '@apollo/react-hooks'
import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import emotionReset from 'emotion-reset'
import type { AppProps } from 'next/app'

import { client } from '@/graphql/client'

const global = css`
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
      Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    line-height: 1.6;
    font-size: 18px;
    background: #d5e5e5;
  }
`

// eslint-disable-next-line react/destructuring-assignment
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Global
          styles={css`
            ${emotionReset}
            ${global}
          `}
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

// eslint-disable-next-line import/no-default-export
export default App

```

## （参考）Queryの作成
雑ではありますが、GitHub GraphQL APIに対して
フォームに入力したid名から検索して
該当のユーザの名前とプロフィールを表示するサンプルをつくりました。
useQueryを使用しています。
※以下のソースコードは今回のコードに直接関係はありません

```tsx
import { gql, useQuery } from '@apollo/client'
import { Box, Button, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'

const USER = gql`
  query USER($id: String!) {
    user(login: $id) {
      name
      bio
    }
  }
`

const Home = () => {
  const [queryResult, setQueryResult] = useState('')
  const [id, setId] = useState('')

  const query = useQuery(USER, {
    variables: { id: id },
  })

  const handleClick = ({ loading, error, data }: any) => {
    if (loading) return 'loading...'
    if (error) return `Error!! ${error.message}`

    return `${data.user.name} ${data.user.bio}`
  }

  const inputId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }

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
          p={4}
          my="10"
          color="#606060"
          fontWeight="bold"
          textAlign="center"
          fontSize="1.5rem"
          borderRadius="30px"
          boxShadow="2px 2px 5px 0px rgba(0,0,0,0.25)"
        >
          GitHub Repository Search
        </Box>
        <Input
          placeholder="insert your github id!"
          size="lg"
          mx="auto"
          w="30vw"
          mb="10"
          onChange={(e) => {
            inputId(e)
          }}
        />
        <Button
          colorScheme="blue"
          mx="auto"
          mb="20"
          w="30vw"
          onClick={() => {
            setQueryResult(handleClick(query))
          }}
        >
          Search!
        </Button>
        <div>{queryResult}</div>
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home

```

## 検索フォームと結果の出力の実装
先ほどのソースコードをもとに、今度は検索フォームに入力されたキーワードをもとに
リポジトリを検索してキーワードに一致したものを列挙する。
ということを行います。
リポジトリの検索結果一覧のテーブル表示のみをコンポーネント化していますが
本当はもっと細かくコンポーネント化したほうが良いと思います。

```index.tsx
import { useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Button, Input } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'

import { RepositoryTable } from '@/components'
import { SEARCH_REPOSITORIES } from '@/graphql/query'

type Variables = {
  after: string | null
  before: string | null
  first: number | null
  last: number | null
}

export type Edges = {
  cursor: string
  node: {
    id: string
    name: string
    url: string
    __typename: string
  }
  __typename: string
}[]

const DEFAULT_STATE: Variables = {
  after: null,
  before: null,
  first: 5,
  last: null,
}

const Home = () => {
  const [title, setTitle] = useState<string>('')
  const [edges, setEdes] = useState<Edges>([])
  const [searchWord, setSearchWord] = useState('')
  const { first, last, before, after } = DEFAULT_STATE

  const qlQuery = useQuery(SEARCH_REPOSITORIES, {
    variables: { query: searchWord, first, last, before, after },
  })

  const handleClick = ({ loading, error, data }: any): string => {
    if (loading) return 'loading...'
    if (error) return `Error!! ${error.message}`

    // eslint-disable-next-line no-console
    console.log(data.search)

    setEdes(data.search.edges)
    return data.search.repositoryCount
  }

  const inputSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value)
  }

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
          p={4}
          my="10"
          color="#606060"
          fontWeight="bold"
          textAlign="center"
          fontSize="1.5rem"
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
          mb="10"
          onChange={(e) => {
            inputSearchWord(e)
          }}
        />
        <Button
          colorScheme="blue"
          mx="auto"
          mb="20"
          w="30vw"
          onClick={() => {
            setTitle(handleClick(qlQuery))
          }}
        >
          Search!
        </Button>
        {title === '' || isNaN(Number(title)) ? (
          <div>Please Insert word</div>
        ) : (
          <>
            <Alert status="success" fontWeight="bold">
              <AlertIcon />
              {`GitHub Repositories Search Result: ${title} Repositories!`}
            </Alert>
            <RepositoryTable edges={edges} />
          </>
        )}
      </Box>
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home

```



```RepositoryTable.tsx
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
```

