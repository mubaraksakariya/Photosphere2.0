import React from 'react';

function ProfileImage({ user }) {
	return (
		<div className='rounded-full overflow-hidden w-profileImage h-profileImage'>
			<img
				src={user?.profile?.profile_image}
				className='w-full h-full object-cover'
				alt={`${user.username}'s profile`}
			/>
		</div>
	);
}

export default ProfileImage;
