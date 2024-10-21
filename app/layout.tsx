"use client";

import Head from "next/head";
import { createGlobalStyle } from "styled-components";
// import "./globals.css";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    overflow: auto;
    background-color: #e6e6e6d0;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <html lang="en">
        <GlobalStyle />
        <body>{children}</body>
      </html>
    </>
  );
}
