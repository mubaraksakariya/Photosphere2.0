import { Share } from 'lucide-react';
import React from 'react';

function ShareBtn({ post }) {
	const { share_count: shareCount } = post;
	const handleShare = () => console.log('Sharing...');
	return (
		<span
			onClick={handleShare}
			className='flex items-center gap-2 px-4 py-2 rounded-md text-lightMode-textPrimary dark:text-darkMode-textPrimary hover:text-lightMode-accent dark:hover:text-darkMode-accent transition-colors duration-200 cursor-pointer active:scale-95 '>
			<Share size={20} />
			<span>{shareCount ? shareCount : 0}</span>
		</span>
	);
}

export default ShareBtn;
