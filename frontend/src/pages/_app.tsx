import type { AppProps } from "next/app";
import "../i18n/config";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  // nothing fancy, i18n initialized already
  return <Component {...pageProps} />;
}
