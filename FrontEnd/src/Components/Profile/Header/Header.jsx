import React from 'react';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';

function Header() {
	const user = useSelector((state) => state.auth.user);
	console.log(user);

	return (
		<div className='flex gap-2 justify-between w-[70%] m-0 sm:m-auto'>
			<div>
				<ProfileImage user={user} />
			</div>
			<div>
				<div className=' flex gap-2'>
					<div>{user.username}</div>
					<div>
						<FollowButton user={user} />
					</div>
				</div>
				<div className=' flex gap-2'>
					<div>followers counts</div>
					<div>posts count</div>
					<div>following count</div>
				</div>
				<div>description</div>
				<div>links</div>
			</div>
		</div>
	);
}

export default Header;
