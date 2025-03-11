import { Link } from 'react-router';

const Hashtags = ({ hashtags }) => {
	return (
		<div className='flex flex-wrap gap-1'>
			{hashtags.map((hashtag) => (
				<Link
					to={`/tags/#${hashtag.tag}`}
					key={hashtag.id}
					className='bg-lightMode-accent dark:bg-darkMode-accent text-lightMode-background dark:text-darkMode-background text-sm px-2 py-1 rounded-full'>
					#{hashtag.tag}
				</Link>
			))}
		</div>
	);
};

export default Hashtags;
