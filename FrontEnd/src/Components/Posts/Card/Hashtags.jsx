const Hashtags = ({ hashtags }) => {
	return (
		<div className='flex flex-wrap gap-1'>
			{hashtags.map((hashtag) => (
				<span
					key={hashtag.id}
					className='bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background text-sm px-2 py-1 rounded-full'
					onClick={() => console.log(`Searching for ${hashtag.tag}`)}>
					#{hashtag.tag}
				</span>
			))}
		</div>
	);
};

export default Hashtags;
