import { memo } from 'react';
import { Link } from 'react-router';

const UserInfo = memo(({ user }) => (
	<div className='flex items-center gap-3 mb-2'>
		<img
			src={user.profile.profile_image}
			alt={`${user.profile.first_name} profile`}
			className='w-10 h-10 rounded-full object-cover'
		/>
		<div className='flex flex-col'>
			<Link
				to={`/profile/${user.id}`}
				className='text-sm font-semibold hover:underline'>
				{user.profile.first_name} {user.profile.last_name}
			</Link>
			<span className='text-xs text-gray-500 dark:text-gray-400'>
				@{user.email}
			</span>
		</div>
	</div>
));

export default UserInfo;
