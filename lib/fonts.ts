import { Bebas_Neue, Instrument_Sans, JetBrains_Mono, Poppins } from "next/font/google";

// Shared by the site layout and the global 404 page (app/global-not-found.tsx), which brings its own document.
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-brand",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${bebasNeue.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${poppins.variable}`;

/** Admin: the same body and data typefaces, without the display fonts. */
export const adminFontVariables = `${instrumentSans.variable} ${jetbrainsMono.variable}`;
