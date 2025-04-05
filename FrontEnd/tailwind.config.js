/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				lightMode: {
					background: '#F5F5F5',
					section: '#D6C0B3',
					textPrimary: '#3B2F2F',
					accent: '#5B3E2B',
					highlight: '#FFF4E0',
					shadow: 'rgba(0, 0, 0, 0.15)',
				},

				darkMode: {
					background: '#1F1C1C',
					section: '#3A2E29',
					textPrimary: '#E0C9B9',
					accent: '#D1B6A2',
					highlight: '#A68A6D',
					shadow: 'rgba(0, 0, 0, 0.7)',
				},
			},
			boxShadow: {
				light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				dark: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
			},
			width: {
				profileImage: 'clamp(90px, 15vw, 150px)',
			},
			height: {
				profileImage: 'clamp(90px, 15vw, 150px)',
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};
