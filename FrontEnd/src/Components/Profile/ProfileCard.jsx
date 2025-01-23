import { useNavigate } from 'react-router';
import FollowButton from './FollowButton/FollowButton';

const ProfileCard = ({ user }) => {
	const navigate = useNavigate();
	const manageProfileOpen = () => {
		navigate(`profile/${user?.id}`);
	};
	return (
		<div
			className='flex gap-2 w-full items-center bg-lightMode-background dark:bg-darkMode-background border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-lg shadow-light dark:shadow-dark p-4 max-w-lg mx-auto transition-colors'
			title={user.email}>
			{/* Profile Image */}
			<div
				className='flex-[1] w-10 h-10 aspect-square cursor-pointer'
				onClick={manageProfileOpen}>
				<img
					src={user?.profile?.profile_image}
					alt={user.username}
					className='w-10 h-10 rounded-full object-cover'
				/>
			</div>

			{/* User Info */}
			<div
				className='flex-[5] cursor-pointer'
				onClick={manageProfileOpen}>
				<h4 className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary text-base truncate'>
					{user.username.length > 15
						? `${user.username.slice(0, 15)}...`
						: user.username}
				</h4>
				<p
					className='text-xs text-lightMode-accent dark:text-darkMode-accent cursor-pointer'
					onClick={manageProfileOpen}>
					{user.email}
				</p>
			</div>

			{/* Follow Icon */}
			<div className='flex-[0]'>
				<FollowButton user={user} />
			</div>
		</div>
	);
};

export default ProfileCard;
