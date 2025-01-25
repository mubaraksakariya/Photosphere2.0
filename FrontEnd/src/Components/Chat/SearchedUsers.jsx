import React from 'react';
import { useInView } from 'react-intersection-observer';
import ChatProfileCard from './ChatProfileCard';
import useInfiniteSearchUsers from '../../CustomHooks/useSearchUsers';

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
	console.log(data);
	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
		if (error) console.error(error);
	}, [inView, hasNextPage, fetchNextPage, error]);
	return (
		<div className='h-full flex flex-col'>
			<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Searched
			</h2>
			<div className='flex flex-col space-y-2'>
				{data?.pages?.map((page) =>
					page.results.map((user) => (
						<ChatProfileCard
							key={user.id}
							title='Recent Chat 2'
							message='Last message...'
						/>
					))
				)}
				<div ref={ref} className='h-10'></div>
			</div>
		</div>
	);
}

export default SearchedUsers;
