import React, { useEffect, useState } from 'react';
import Header from '../../Components/Profile/Header/Header';
import { useParams } from 'react-router';
import useProfile from '../../CustomHooks/useProfile';
import UserPosts from '../../Components/Profile/UserPosts/UserPosts';

function Profile() {
	const { user_id } = useParams();
	const [user, setUser] = useState({});
	const { data, isLoading, error } = useProfile(user_id);

	useEffect(() => {
		if (data) {
			setUser(data.user);
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading profile: {error.message}</div>;
	}

	return (
		<div className='min-h-[100dvh] flex flex-col bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
			<div className='px-4 md:px-6 lg:px-8'>
				<div className='bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark py-2 px-3 sm:py-4 sm:px-6'>
					{/* Pass the user data to the Header component */}
					<Header user={user} />
				</div>
			</div>
			<div className='flex-1 gap-4 p-4 md:p-6 lg:p-8'>
				{/* Display user's posts or other content */}
				<UserPosts user={user} />
			</div>
		</div>
	);
}

export default Profile;
