import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../Contexts/ChatContext';
import { useInView } from 'react-intersection-observer';
import TypingIndicator from './TypingIndicator';
import LoadingRing from '../Loading/LoadingRing';

function ChatMessages() {
	const {
		currentChat,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetchingNextPage,
		isLoading,
		data,
	} = useChat();

	const userId = currentChat?.members[0]?.id;
	const { ref, inView } = useInView();
	const chatContainerRef = useRef(null);
	const [isAtBottom, setIsAtBottom] = useState(true);

	// Check if the user is at the bottom of the chat
	const checkIfAtBottom = () => {
		if (chatContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				chatContainerRef.current;
			const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px buffer
			setIsAtBottom(isBottom);
		}
	};

	// Scroll to bottom only if the user is at the bottom
	const scrollToBottom = () => {
		if (chatContainerRef.current && isAtBottom) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	};

	// Scroll to bottom on initial load and new messages
	useEffect(() => {
		scrollToBottom();
	}, [data]); // Trigger when `data` changes

	// Fetch older messages when the user scrolls to the top
	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	// Add scroll event listener to track scroll position
	useEffect(() => {
		const container = chatContainerRef.current;
		if (container) {
			container.addEventListener('scroll', checkIfAtBottom);
			return () =>
				container.removeEventListener('scroll', checkIfAtBottom);
		}
	}, []);

	if (isLoading && !data)
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
	if (isError)
		return (
			<p className='text-red-500 flex justify-center items-center h-full'>
				Failed to load messages. Please try again later.
			</p>
		);

	return (
		<div
			ref={chatContainerRef}
			className='h-full flex flex-col-reverse gap-4 p-4 overflow-y-auto space-y-4'
			onScroll={checkIfAtBottom}>
			<TypingIndicator userId={userId} />

			{/* Render messages */}
			{data?.pages?.map((page) =>
				page.results.map((message) => (
					<MessageBubble key={message.id} message={message} />
				))
			)}

			{isFetchingNextPage && (
				<div className='flex justify-center py-4'>
					<span>Loading more messages...</span>
				</div>
			)}

			{/* Trigger for infinite scroll */}
			<div ref={ref} className='h-10'></div>
		</div>
	);
}

export default ChatMessages;
