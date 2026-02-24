import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/sfavicon.png" />
        <link rel="icon" href="/sfavicon.ico" sizes="48x48" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
