import { useInView } from 'react-intersection-observer';
import React from 'react';
import ChatProfileCard from './ChatProfileCard';
import ChatProfileThumpnail from './ChatProfileThumpnail';
import useChatUsers from '../../CustomHooks/useChatUsers';

function ChatList() {
	const { ref, inView } = useInView();
	// React.useEffect(() => {
	// 	if (inView && hasNextPage) {
	// 		fetchNextPage();
	// 	}
	// 	if (error) console.error(error);
	// }, [inView, hasNextPage, fetchNextPage, error]);
	const { data, isLoading, error } = useChatUsers();
	console.log(data);

	return (
		<div className='h-full flex flex-col'>
			{/* Favorite Chats */}
			<div className='mb-6'>
				<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
					Favorite Chats
				</h2>
				<div className='flex space-x-2'>
					<ChatProfileThumpnail />
					<ChatProfileThumpnail />
				</div>
			</div>

			{/* Recent Chats */}
			<div>
				<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
					Recent Chats
				</h2>
				<div className='flex flex-col space-y-2'>
					<ChatProfileCard
						title='Recent Chat 1'
						message='Last message...'
					/>
					<ChatProfileCard
						title='Recent Chat 2'
						message='Last message...'
					/>
					{/* {data?.pages?.map((page) =>
						page.results.map((post) => (
							<ChatProfileCard
								title='Recent Chat 2'
								message='Last message...'
							/>
						))
					)} */}
					<div ref={ref} className='h-10'></div>
				</div>
			</div>
		</div>
	);
}

export default ChatList;
