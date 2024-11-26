import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			main_blue: '#0D6EFD',
  			sec_blue: '#EBF3FF',
  			black: '#1E1E1E',
  			dark_grey: '#676767',
  			light_grey: '#C4C4C4',
  			yellow: '#E9AE00',
  			alt_green: '#02562F',
  			alt_red: '#9E0F0B'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
