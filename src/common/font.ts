import localFont from "next/font/local";
import { Bebas_Neue } from "next/font/google";

const layGrotesk = localFont({
  src: "./fonts/laygrotesk-regular.otf",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export { layGrotesk, bebasNeue };
