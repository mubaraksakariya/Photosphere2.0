import { useSettings } from '../../Contexts/SettingsContext';

const DarkModeToggle = () => {
	const { darkMode, manageDarkMode } = useSettings();
	return (
		<select
			value={darkMode}
			onChange={(e) => manageDarkMode(e.target.value)}
			className='h-8 px-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'>
			<option value='light'>Light Mode</option>
			<option value='dark'>Dark Mode</option>
			<option value='system'>System Default</option>
		</select>
	);
};

export default DarkModeToggle;
