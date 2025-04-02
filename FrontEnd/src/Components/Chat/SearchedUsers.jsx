import React from 'react';
import { useInView } from 'react-intersection-observer';
import SearchedChatProfileCard from './SearchedChatProfileCard';
import useInfiniteSearchUsers from '../../CustomHooks/useSearchUsers';
import LoadingRing from '../Loading/LoadingRing';

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
	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
		if (error) console.error(error);
	}, [inView, hasNextPage, fetchNextPage, error]);
	return (
		<div className='flex flex-col min-h-full max-h-full'>
			<h2 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-2'>
				Searched
			</h2>
			{isLoading && (
				<div className='flex justify-center py-4'>
					<LoadingRing />
				</div>
			)}
			{error && (
				<div className='flex justify-center py-4'>
					<span className='text-red-500'>Error loading users...</span>
				</div>
			)}
			{!isLoading && !error && data?.pages[0].count < 1 && (
				<div className='flex justify-center py-4'>
					<span className='text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
						No users found for that query.
					</span>
				</div>
			)}
			<div className='flex flex-1 flex-col space-y-2 overflow-y-auto'>
				{data?.pages?.map((page) =>
					page.results.map((user) => (
						<SearchedChatProfileCard key={user.id} user={user} />
					))
				)}
				{isFetchingNextPage && (
					<div className='flex justify-center py-4'>
						<LoadingRing />
					</div>
				)}
				<div ref={ref} className='h-10'></div>
			</div>
		</div>
	);
}

export default SearchedUsers;
