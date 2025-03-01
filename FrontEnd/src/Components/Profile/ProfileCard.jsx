import { useNavigate } from 'react-router';
import FollowButton from './FollowButton/FollowButton';

const ProfileCard = ({ user }) => {
	const navigate = useNavigate();
	const { profile_image } = user.profile;
	const { username, email } = user;
	const nameMaxLength = 15;
	const getTruncatedText = (text) =>
		text.length > nameMaxLength
			? `${text.slice(0, nameMaxLength)}...`
			: text;
	const manageProfileOpen = () => {
		navigate(`/profile/${user?.id}`);
	};
	return (
		<div
			className='flex gap-2 w-72 max-w-lg items-center bg-lightMode-background dark:bg-darkMode-background border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-lg shadow-light dark:shadow-dark p-4  transition-colors'
			title={user.email}>
			{/* Profile Image */}
			<div
				className=' w-10 h-10 aspect-square cursor-pointer'
				onClick={manageProfileOpen}>
				<img
					src={profile_image}
					alt={username}
					className='w-10 h-10 rounded-full object-cover'
				/>
			</div>

			{/* User Info */}
			<div
				className='flex-[5] cursor-pointer'
				onClick={manageProfileOpen}>
				<h4 className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary text-base truncate'>
					{getTruncatedText(username)}
				</h4>
				<p
					className='text-xs text-lightMode-accent dark:text-darkMode-accent cursor-pointer'
					onClick={manageProfileOpen}>
					{getTruncatedText(email)}
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
