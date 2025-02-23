import { useState, useEffect } from 'react';

export const useTheme = () => {
	const getSystemTheme = () =>
		window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';

	const getStoredTheme = () => {
		const theme = localStorage.getItem('theme') || 'system';
		return theme === 'system' ? getSystemTheme() : theme;
	};

	const [theme, setTheme] = useState(getStoredTheme);

	useEffect(() => {
		const applyTheme = () => {
			if (theme === 'system') {
				document.documentElement.classList.toggle(
					'dark',
					getSystemTheme() === 'dark'
				);
			} else {
				document.documentElement.classList.toggle(
					'dark',
					theme === 'dark'
				);
			}
		};

		applyTheme();

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemThemeChange = () => {
			if (localStorage.getItem('theme') === 'system') {
				setTheme(getSystemTheme());
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);
		return () =>
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
	}, [theme]);

	const setThemePreference = (value) => {
		localStorage.setItem('theme', value);
		setTheme(value === 'system' ? getSystemTheme() : value);
	};

	return { theme, setThemePreference };
};
