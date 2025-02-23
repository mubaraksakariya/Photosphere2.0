import React from 'react';
import { NavLink } from 'react-router';
import {
	CornerUpLeft,
	User,
	Lock,
	Bell,
	Settings,
	Settings2,
} from 'lucide-react'; // Icons

const SidebarNav = () => {
	return (
		<aside className='w-full flex justify-between md:flex-col h-fit sticky top-4'>
			<NavLink
				to='/'
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<CornerUpLeft size={20} />
				<span className='hidden md:block'>Back</span>
			</NavLink>

			<NavLink
				to='/settings/general'
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Settings2 size={20} />
				<span className='hidden md:block'>General Settings</span>
			</NavLink>

			<NavLink
				to='/settings/account'
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Settings size={20} />
				<span className='hidden md:block'>Account Settings</span>
			</NavLink>

			<NavLink
				to='/settings/privacy'
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Lock size={20} />
				<span className='hidden md:block'>Privacy Settings</span>
			</NavLink>

			<NavLink
				to='/settings/notifications'
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Bell size={20} />
				<span className='hidden md:block'>Notification Settings</span>
			</NavLink>
		</aside>
	);
};

export default SidebarNav;
