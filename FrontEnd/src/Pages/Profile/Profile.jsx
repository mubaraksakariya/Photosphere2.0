import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import Header from '../../Components/Profile/Header/Header';
import useProfile from '../../CustomHooks/useProfile';
import UserPosts from '../../Components/Profile/UserPosts/UserPosts';
import ProfileNav from '../../Components/Profile/Navigation/ProfileNav';
import UserFollowers from '../../Components/Profile/UserFollowers/UserFollowers';
import { Underline } from 'lucide-react';
import { ta } from 'date-fns/locale';
import UserFollowings from '../../Components/Profile/UserFollowings/UserFollowings';

function Profile() {
	const { user_id, tab } = useParams();
	const navigate = useNavigate();

	const [user, setUser] = useState({});
	const CurrentUser = useSelector((state) => state.auth.user);
	const isSelfProfile = user_id ? CurrentUser?.id === user_id : true;
	const { data, isLoading, error } = useProfile(user_id);

	const selectedTab = () => {
		switch (tab) {
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

	useEffect(() => {
		if (data) {
			setUser(data.user);
		}
	}, [data]);
	useEffect(() => {
		if (tab === undefined) {
			navigate(`${location.pathname}/overview`, { replace: true });
		}
		if (user_id === undefined) {
			navigate(`${CurrentUser.id}/overview?`, {
				replace: true,
			});
		}
	}, [location, navigate]);
	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen text-lg text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen text-lg text-red-500'>
				Error loading profile: {error.message}
			</div>
		);
	}

	return (
		<div className='min-h-screen flex flex-col md:flex-row bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
			{/* Main Content */}
			<div className='flex-1 flex flex-col p-4 md:p-6 lg:p-8'>
				{/* Header Section */}
				<div className='px-4 md:px-6 lg:px-8'>
					<div className='relative bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark py-4 px-4 sm:py-6 sm:px-8 rounded-2xl'>
						<Header user={user} />
					</div>
				</div>

				{/* Content Section */}
				<div className='flex-1 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6'>
					{/* Sidebar for Mobile View */}
					<div className='md:hidden'>
						<ProfileNav user={user} />
					</div>
					{/* Left Sidebar Navigation (Hidden on small screens) */}
					<div className='w-60 hidden md:block'>
						<ProfileNav user={user} />
					</div>
					{/* User Posts */}
					<div className='flex-1'>{selectedTab()}</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
