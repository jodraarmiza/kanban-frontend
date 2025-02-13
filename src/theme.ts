import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light", // Default mode adalah light
  useSystemColorMode: true, // Menggunakan mode dark/light berdasarkan sistem
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
  },
  colors: {
    primary: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
        _dark: {
          bg: "gray.900",
          color: "gray.200",
        },
      },
    },
  },
});

export default theme;
