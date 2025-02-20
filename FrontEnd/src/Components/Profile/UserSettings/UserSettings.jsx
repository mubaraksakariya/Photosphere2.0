import React, { useState, useEffect } from 'react';
import LoadingRing from '../../Loading/LoadingRing';
import { useSettings } from '../../../Contexts/SettingsContext';
import DarkModeToggle from '../../Theme/DarkModeToggle';

const UserSettings = () => {
	const { settings, changeSetting, saveSettings, isLoading, error } =
		useSettings();
	const [formState, setFormState] = useState({
		language: 'en',
		email_notifications: true,
		push_notifications: true,
		is_profile_public: true,
		allow_messages_from_strangers: true,
	});

	useEffect(() => {
		if (settings) {
			setFormState(settings);
		}
	}, [settings]);

	const handleChange = (e) => {
		const { name, type, checked, value } = e.target;
		const newValue = type === 'checkbox' ? checked : value;
		setFormState((prevState) => ({
			...prevState,
			[name]: newValue,
		}));
		changeSetting(name, newValue);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		saveSettings();
	};

	if (isLoading) {
		return <LoadingRing />;
	}

	if (error) {
		return (
			<div className='text-center text-lg text-red-500'>
				Error loading settings: {error.message}
			</div>
		);
	}

	return (
		<div className='p-6 md:p-8 bg-lightMode-section dark:bg-darkMode-section rounded-2xl dark:shadow-xl max-w-3xl mx-auto'>
			<h2 className='text-2xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-6 text-center'>
				User Settings
			</h2>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex items-center justify-between'>
					<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Theme
					</span>
					<DarkModeToggle />
				</div>
				{[
					{ label: 'Profile Public', name: 'is_profile_public' },
					{
						label: 'Email Notifications',
						name: 'email_notifications',
					},
					{ label: 'Push Notifications', name: 'push_notifications' },
					{
						label: 'Allow Messages from Strangers',
						name: 'allow_messages_from_strangers',
					},
				].map(({ label, name }) => (
					<div
						key={name}
						className='flex items-center justify-between'>
						<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
							{label}
						</span>
						<input
							type='checkbox'
							name={name}
							checked={formState[name]}
							onChange={handleChange}
							className='form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
						/>
					</div>
				))}

				<div className='flex items-center justify-between'>
					<span className='text-lightMode-textPrimary dark:text-darkMode-textPrimary font-medium'>
						Language
					</span>
					<select
						name='language'
						value={formState.language}
						onChange={handleChange}
						className='p-2 border border-gray-300 dark:border-gray-600 bg-lightMode-background dark:bg-darkMode-background rounded-md'>
						<option value='en'>English</option>
						<option value='es'>Spanish</option>
					</select>
				</div>
				<div className=' flex justify-start pt-5'>
					<button
						type='submit'
						className='bg-blue-500 dark:bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-700 transition'>
						Save Settings
					</button>
				</div>
			</form>
		</div>
	);
};

export default UserSettings;
