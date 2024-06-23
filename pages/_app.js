import { FlashMessageProvider } from '../hooks/flash-message';
import Layout from '../components/layout/layout';
import FlashMessage from '../components/flash-message';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <FlashMessageProvider>
        <FlashMessage />
        <Component {...pageProps} />
      </FlashMessageProvider>
    </Layout>
  );
}

export default MyApp;
