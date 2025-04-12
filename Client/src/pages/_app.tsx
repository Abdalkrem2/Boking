import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../../store";
import { Provider } from "react-redux";
import Header from "../../components/Header";
import MobileHeader from "../../components/MobileHeader";
import Footer from "../../components/Footer";
import "../styles/scrollBar.css";
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
        <MobileHeader />
        <Footer />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
