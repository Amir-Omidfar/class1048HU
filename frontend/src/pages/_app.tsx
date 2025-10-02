import type { AppProps } from "next/app";
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
        <Component {...pageProps} />
    </ThemeProvider>
  );
}
