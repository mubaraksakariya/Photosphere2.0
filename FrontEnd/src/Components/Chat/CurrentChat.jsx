import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import CurrentChatClose from './CurrentChatClose';

function CurrentChat() {
	return (
		<div className='bg-lightMode-background dark:bg-darkMode-background flex flex-col h-dvh md:h-full md:flex-1'>
			<div className='relative'>
				<div className='md:hidden absolute top-2 right-2'>
					<CurrentChatClose />
				</div>
				<ChatHeader />
			</div>
			{/* Ensure ChatMessages takes remaining height */}
			<div className='flex-1 overflow-hidden'>
				<ChatMessages />
			</div>
			<ChatInput />
		</div>
	);
}

export default CurrentChat;
