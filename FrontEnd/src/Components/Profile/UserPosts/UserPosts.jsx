import React from 'react';
import useUserPosts from '../../../CustomHooks/useUserPosts';
import { useInView } from 'react-intersection-observer';
import UserPostCard from './UserPostCard';
import LoadingRing from '../../Loading/LoadingRing';

function UserPosts({ user }) {
	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = useUserPosts(user?.id);

	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (isLoading && !data) {
		return <LoadingRing />;
	}
	if (isError)
		return (
			<p className='text-red-500'>
				Failed to load posts. Please try again later.
			</p>
		);

	if (data?.pages[0].count < 1)
		return <p className='text-gray-500'>No posts available.</p>;

	return (
		<div className='max-h-[73vh] md:overflow-y-auto'>
			<div className='flex flex-wrap justify-center items-center gap-5'>
				{data?.pages?.map((page) =>
					page.results.map((post) => (
						<UserPostCard key={post.id} post={post} />
					))
				)}
				{isFetchingNextPage && (
					<div className='flex justify-center py-4'>
						<span>Loading more posts...</span>
					</div>
				)}
				<div ref={ref} className='h-10 w-full'></div>
			</div>
		</div>
	);
}

export default UserPosts;
