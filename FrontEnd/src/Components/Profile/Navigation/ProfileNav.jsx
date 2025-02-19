import React from 'react';
import { NavLink } from 'react-router';
import { User, FileText, Users, Settings, CornerUpLeft } from 'lucide-react'; // Icons

function ProfileNav({ user }) {
	const user_id = user.id;
	return (
		<aside className='w-full flex justify-between md:flex-col h-fit sticky top-4'>
			<NavLink
				to={`/`}
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
				to={`/profile/${user_id}/overview`}
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<User size={20} />
				<span className='hidden md:block'>Overview</span>
			</NavLink>
			<NavLink
				to={`/profile/${user_id}/posts`}
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<FileText size={20} />
				<span className='hidden md:block'>Posts</span>
			</NavLink>
			<NavLink
				to={`/profile/${user_id}/followers`}
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Users size={20} />
				<span className='hidden md:block'>Followers</span>
			</NavLink>
			<NavLink
				to={`/profile/${user_id}/followings`}
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Users size={20} />
				<span className='hidden md:block'>Following</span>
			</NavLink>
			<NavLink
				to={`/profile/${user_id}/settings`}
				className={({ isActive }) =>
					`flex items-center gap-3 p-3 rounded-md transition-all ${
						isActive
							? 'bg-lightMode-accent text-white'
							: 'hover:bg-gray-200 dark:hover:bg-gray-700'
					}`
				}>
				<Settings size={20} />
				<span className='hidden md:block'>Settings</span>
			</NavLink>
		</aside>
	);
}

export default ProfileNav;
