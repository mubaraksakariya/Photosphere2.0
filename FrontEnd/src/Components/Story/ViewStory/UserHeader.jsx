const UserHeader = ({ profileImage, username, email, onClose }) => (
	<div className='flex justify-between items-center mb-2'>
		<div className='flex items-center gap-4'>
			<img
				src={profileImage}
				alt={username}
				className='w-10 h-10 rounded-full object-cover border border-lightMode-shadow dark:border-darkMode-shadow'
			/>
			<div>
				<p className='text-lg text-lightMode-textPrimary dark:text-darkMode-textPrimary font-semibold'>
					{username}
				</p>
				<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					{email}
				</p>
			</div>
		</div>
		<button
			className='text-red-600 hover:text-red-800 transition-colors text-xl'
			onClick={onClose}
			aria-label='Close Modal'>
			&times;
		</button>
	</div>
);
export default UserHeader;
