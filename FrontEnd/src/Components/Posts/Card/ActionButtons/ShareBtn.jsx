import { Share } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openSharePostModal } from '../../../../Store/Slices/ModalSlice';

function ShareBtn({ post }) {
	const { share_count: shareCount } = post;
	const dispatch = useDispatch();

	const handleShare = () => {
		console.log('Sharing...');
		dispatch(openSharePostModal({ post }));
	};
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
