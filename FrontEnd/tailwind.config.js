/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				lightMode: {
					background: '#E4E0E1', // Main background color
					section: '#D6C0B3', // Section backgrounds
					textPrimary: '#AB886D', // Primary text and border
					accent: '#493628', // Buttons, icons, and highlights
					gradientStart: '#E4E0E1', // Gradient start
					gradientEnd: '#D6C0B3', // Gradient end
					shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
				},
				darkMode: {
					background: '#2E2B2C', // Main background color
					section: '#4F4038', // Section backgrounds
					textPrimary: '#7C5E4E', // Primary text and border
					accent: '#B89C8B', // Buttons, icons, and highlights
					gradientStart: '#4F4038', // Gradient start
					gradientEnd: '#2E2B2C', // Gradient end
					shadow: 'rgba(0, 0, 0, 0.5)', // Subtle shadow
				},
			},
			boxShadow: {
				light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Light mode shadow
				dark: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)', // Dark mode shadow
			},
			gradientColorStops: (theme) => ({
				...theme('colors'),
				'light-start': '#E4E0E1',
				'light-end': '#D6C0B3',
				'dark-start': '#4F4038',
				'dark-end': '#2E2B2C',
			}),
		},
	},
	plugins: [],
	darkMode: 'class', // Enables dark mode using the 'class' strategy
};
