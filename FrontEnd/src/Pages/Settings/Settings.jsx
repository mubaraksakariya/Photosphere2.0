import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import SidebarNav from '../../Components/Settings/SidebarNav';
import AccountSettings from '../../Components/Settings/AccountSettings';
import PrivacySettings from '../../Components/Settings/PrivacySettings';
import NotificationSettings from '../../Components/Settings/NotificationSettings';
import GeneralSettings from '../../Components/Settings/GeneralSettings';
import { useSelector } from 'react-redux';

function Settings() {
	const user = useSelector((state) => state.auth.user);

	return (
		<div className='min-h-screen bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary flex flex-col md:flex-row gap-4 p-4 md:p-6 lg:p-8'>
			<div className='w-1/4 hidden md:block p-4 md:px-6 lg:px-8 bg-lightMode-section dark:bg-darkMode-section rounded-lg shadow-md'>
				<SidebarNav />
			</div>
			<div className='md:w-3/4 min-h-[90dvh] p-4 md:px-6 lg:px-8 bg-lightMode-section dark:bg-darkMode-section rounded-lg shadow-md'>
				<Routes>
					<Route path='/' element={<Navigate to='general' />} />
					<Route
						path='general'
						element={<GeneralSettings currentUser={user} />}
					/>
					<Route
						path='account'
						element={<AccountSettings currentUser={user} />}
					/>
					<Route
						path='privacy'
						element={<PrivacySettings currentUser={user} />}
					/>
					<Route
						path='notifications'
						element={<NotificationSettings currentUser={user} />}
					/>
				</Routes>
			</div>
			<div className=' w-full md:hidden absolute bottom-0 left-0'>
				<SidebarNav />
			</div>
		</div>
	);
}

export default Settings;
