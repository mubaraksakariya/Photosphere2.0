const UserDetails = ({ user }) => {
	return (
		<div className='flex items-center p-4 border-b border-lightMode-textPrimary dark:border-darkMode-textPrimary'>
			<img
				src={user.profile_image}
				alt={user.username}
				className='w-14 h-14 rounded-full object-cover mr-4'
			/>
			<div>
				<h4 className='font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					{user.first_name} {user.last_name}
				</h4>
				<p className='text-sm text-lightMode-accent dark:text-darkMode-accent'>
					@{user.username}
				</p>
			</div>
		</div>
	);
};

export default UserDetails;
