import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import "../i18n/config";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </ThemeProvider>
  );
}
