/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				lightMode: {
					background: '#E4E0E1',
					section: '#D6C0B3',
					textPrimary: '#AB886D',
					accent: '#493628',
					highlight: '#FFF4E0', // Light cream highlight
					shadow: 'rgba(0, 0, 0, 0.1)',
				},
				darkMode: {
					background: '#2E2B2C',
					section: '#4F4038',
					textPrimary: '#7C5E4E',
					accent: '#B89C8B',
					highlight: '#A68A6D', // Muted champagne highlight
					shadow: 'rgba(0, 0, 0, 0.5)',
				},
			},
			boxShadow: {
				light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				dark: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
			},
			width: {
				profileImage: 'clamp(110px, 15vw, 200px)',
			},
			height: {
				profileImage: 'clamp(110px, 15vw, 200px)',
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};
