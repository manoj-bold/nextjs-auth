import { SessionProvider } from "next-auth/react";
import { FlashMessageProvider } from "../hooks/flash-message";
import Layout from "../components/layout/layout";
import FlashMessage from "../components/flash-message";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <FlashMessageProvider>
          <FlashMessage />
          <Component {...pageProps} />
        </FlashMessageProvider>
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
