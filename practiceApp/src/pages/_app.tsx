import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import emotionReset from 'emotion-reset'
import type { AppProps } from 'next/app'

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
    <ChakraProvider>
      <Global
        styles={css`
          ${emotionReset}
          ${global}
        `}
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

// eslint-disable-next-line import/no-default-export
export default App
