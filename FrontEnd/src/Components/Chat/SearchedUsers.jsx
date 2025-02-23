import React from 'react';
import { useInView } from 'react-intersection-observer';
import useInfiniteSearchUsers from '../../CustomHooks/useSearchUsers';
import SearchedChatProfileCard from './ChatProfileCard';

function SearchedUsers({ searchQuery }) {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
	} = useInfiniteSearchUsers(searchQuery);
	const { ref, inView } = useInView();
	// console.log(data);
	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
		if (error) console.error(error);
	}, [inView, hasNextPage, fetchNextPage, error]);
	return (
		<div className='flex flex-col'>
			<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Searched
			</h2>
			<div className='flex flex-col space-y-2'>
				{data?.pages?.map((page) =>
					page.results.map((user) => (
						<SearchedChatProfileCard
							key={user.id}
							message='Last message...'
							user={user}
						/>
					))
				)}
				<div ref={ref} className='h-10'></div>
			</div>
		</div>
	);
}

export default SearchedUsers;
