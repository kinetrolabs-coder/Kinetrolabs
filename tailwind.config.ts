import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#0F0A1F", violet: "#3878F8", lime: "#3878F8", paper: "#F5F3FF" }, fontFamily: { display: ["var(--font-space)", "sans-serif"], body: ["var(--font-inter)", "sans-serif"] } } },
  plugins: []
};
export default config;
