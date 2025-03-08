import React from 'react';

function Comment({ comment }) {
	return (
		<div className='flex gap-3 m-3'>
			{/* Profile Image */}
			<img
				src={comment.user.profile.profile_image}
				alt={comment.user.username}
				className='w-10 h-10 rounded-full border border-lightMode-accent dark:border-darkMode-accent shrink-0'
			/>

			{/* Comment Box */}
			<div className='flex flex-col  bg-lightMode-background dark:bg-darkMode-background  shadow-light dark:shadow-dark rounded-2xl p-4 w-full'>
				{/* Username */}
				<p className='text-sm font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					{comment.user.username}
				</p>

				{/* Comment Text */}
				<p className='text-sm leading-relaxed text-lightMode-textPrimary dark:text-darkMode-textPrimary opacity-90'>
					{comment.text}
				</p>
			</div>
		</div>
	);
}

export default Comment;
