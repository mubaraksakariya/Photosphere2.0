import React from 'react';
import useSuggestedUsers from '../../../CustomHooks/useSuggestedUsers';
import ProfileCard from '../../Profile/ProfileCard';

function SuggestedUsers() {
	const { data, isLoading, error } = useSuggestedUsers();
	const suggestedUsers = data?.suggested_users || [];

	if (isLoading) return <p>Loading...</p>;
	if (error)
		return <p>Error fetching suggested users. Please try again later.</p>;

	return (
		<div className='space-y-4'>
			{suggestedUsers.length > 0 ? (
				suggestedUsers.map((user) => (
					<ProfileCard user={user} key={user.email} />
				))
			) : (
				<p>No suggested users available.</p>
			)}
		</div>
	);
}

export default SuggestedUsers;
