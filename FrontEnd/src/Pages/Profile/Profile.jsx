import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Header from '../../Components/Profile/Header/Header';
import useProfile from '../../CustomHooks/useProfile';
import UserPosts from '../../Components/Profile/UserPosts/UserPosts';
import ProfileNav from '../../Components/Profile/Navigation/ProfileNav';
import UserFollowers from '../../Components/Profile/UserFollowers/UserFollowers';
import UserFollowings from '../../Components/Profile/UserFollowings/UserFollowings';
import UserDetails from '../../Components/Profile/UserDetails/UserDetails';
import UserDetailsEdit from '../../Components/Profile/UserDetails/UserDetailsEdit';
import LoadingRing from '../../Components/Loading/LoadingRing';

function Profile() {
	const { user_id: paramUserId, tab } = useParams();
	const navigate = useNavigate();

	const [user, setUser] = useState({});
	const CurrentUser = useSelector((state) => state.auth.user);
	const user_id = paramUserId || CurrentUser?.id;
	const isSelfProfile = user_id ? CurrentUser?.id == user_id : true;
	const { data, isLoading, error } = useProfile(user_id);

	// Function to select the appropriate tab content
	const selectedTab = () => {
		switch (tab) {
			case 'overview':
				return isSelfProfile && user ? (
					<UserDetailsEdit user={user} />
				) : (
					<UserDetails user={user} />
				);
			case 'posts':
				return <UserPosts user={user} />;
			case 'followers':
				return <UserFollowers userId={user.id} />;
			case 'followings':
				return <UserFollowings userId={user.id} />;
			default:
				return <UserPosts user={user} />;
		}
	};

	// Effect to set user data when profile data is fetched
	useEffect(() => {
		if (data) {
			setUser(data.user);
		}
	}, [data]);

	// Effect to handle navigation based on tab and user ID
	useEffect(() => {
		if (!tab) {
			navigate(`${location.pathname}/overview`, { replace: true });
		}
		if (!paramUserId) {
			navigate(`${CurrentUser.id}/overview`, { replace: true });
		}
	}, [location, navigate, paramUserId, CurrentUser.id]);

	// Show loading indicator while fetching data
	if (isLoading) {
		return <LoadingRing />;
	}

	// Show error message if there is an error fetching data
	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen text-lg text-red-500'>
				Error loading profile: {error.message}
			</div>
		);
	}

	return (
		<div className='min-h-[100dvh] bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary flex flex-col pb-2'>
			{/* Header Section */}
			<div className='md:px-6 lg:px-8 px-0 pb-0'>
				<Header user={user} />
			</div>

			{/* Main Content */}
			<div className='flex flex-1 flex-col md:flex-row gap-4 pt-4 md:px-6 lg:px-8 pb-0 max-h-[85dvh] overflow-y-auto'>
				{/* Left Navigation - Hidden on smaller screens */}
				<div className='md:flex-[1] hidden md:block bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg p-3'>
					<ProfileNav user={user} />
				</div>

				{/* Profile Content - Scrollable */}
				<div className=' max-h-full overflow-auto md:flex-[4] flex-1 bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg p-6'>
					{selectedTab()}
				</div>
			</div>

			{/* Left Navigation at Bottom on Small Screens */}
			<div className='md:hidden fixed bottom-0 left-0 w-full bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-3 border-t'>
				<ProfileNav user={user} />
			</div>
		</div>
	);
}

export default Profile;
