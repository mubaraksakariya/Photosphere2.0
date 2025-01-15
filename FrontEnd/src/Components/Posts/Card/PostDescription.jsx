const PostDescription = ({ description }) => {
	return (
		<p className='text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
			{description}
		</p>
	);
};

export default PostDescription;
