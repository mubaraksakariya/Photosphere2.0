import React, { createContext, useContext, useState, useEffect } from 'react';
import {
	useUserSettings,
	useUpdateUserSettings,
} from '../CustomHooks/useUserSettings';
import LoadingRing from '../Components/Loading/LoadingRing';
import { useSelector } from 'react-redux';
import { useAlert } from './AlertContext';
import { useTheme } from '../CustomHooks/useTheme'; // Import the custom hook

const SettingsContext = createContext();

export const useSettings = () => {
	return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
	const user = useSelector((state) => state.auth.user);
	const { data: settings, isLoading, error } = useUserSettings(user?.id);
	const { mutate: updateUserSettings } = useUpdateUserSettings(user?.id);
	const [settingsState, setSettingsState] = useState(null);
	const { theme: darkMode, setThemePreference: manageDarkMode } = useTheme();

	const { showSuccessAlert, showConfirm, showErrorAlert, showError } =
		useAlert();

	useEffect(() => {
		if (settings) {
			setSettingsState(settings);
		}
	}, [settings]);

	const changeSetting = (name, value) => {
		setSettingsState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const saveSettings = () => {
		if (settingsState) {
			showConfirm('Are you sure you want to save these settings?', () =>
				updateUserSettings(settingsState, {
					onSuccess: () =>
						showSuccessAlert('Settings saved successfully'),
					onError: (error) => showError(error.message),
				})
			);
		}
	};

	if (isLoading) {
		return <LoadingRing />;
	}

	if (error) {
		return <div>Error loading settings: {error.message}</div>;
	}

	return (
		<SettingsContext.Provider
			value={{
				settings: settingsState,
				changeSetting,
				saveSettings,
				darkMode,
				manageDarkMode,
			}}>
			{children}
		</SettingsContext.Provider>
	);
};
