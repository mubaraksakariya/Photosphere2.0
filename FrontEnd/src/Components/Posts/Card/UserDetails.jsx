const UserDetails = ({ user }) => {
	return (
		<div className='flex items-center p-4 border-b border-lightMode-textPrimary dark:border-darkMode-textPrimary'>
			<img
				src={user?.profile.profile_image}
				alt={user?.username}
				className='md:w-14 w-10 aspect-square rounded-full object-cover mr-4'
			/>
			<div>
				<h4 className='font-semibold text-sm md:text-base text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					{user?.profile.first_name} {user?.profile.last_name}
				</h4>
				<p className='text-xs md:text-sm text-lightMode-accent dark:text-darkMode-accent'>
					@{user?.username}
				</p>
			</div>
		</div>
	);
};

export default UserDetails;
