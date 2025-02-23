import React, { useEffect, useState } from 'react';
import { useChat } from '../../Contexts/ChatContext';

const TypingIndicator = ({ userId }) => {
	const [typing, setTyping] = useState(false);
	const { whoIsTyping, getIsUserTyping } = useChat();

	useEffect(() => {
		if (getIsUserTyping(userId)) {
			setTyping(true);
		} else setTyping(false);
	}, [whoIsTyping]);
	if (!typing) return null;
	return (
		<div className='flex items-center space-x-2'>
			<div className='bg-lightMode-highlight dark:bg-darkMode-highlight text-lightMode-textPrimary dark:text-darkMode-textPrimary px-4 py-2 rounded-2xl shadow-light dark:shadow-dark flex items-center'>
				{/* <span className='text-sm mr-2'>Typing</span> */}
				<div className='flex space-x-1 py-1'>
					<span className='w-2 h-2 bg-lightMode-textPrimary dark:bg-darkMode-textPrimary rounded-full animate-bounce [animation-delay:0ms]'></span>
					<span className='w-2 h-2 bg-lightMode-textPrimary dark:bg-darkMode-textPrimary rounded-full animate-bounce [animation-delay:150ms]'></span>
					<span className='w-2 h-2 bg-lightMode-textPrimary dark:bg-darkMode-textPrimary rounded-full animate-bounce [animation-delay:300ms]'></span>
				</div>
			</div>
		</div>
	);
};

export default TypingIndicator;
