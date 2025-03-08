import React from 'react';
import { useInView } from 'react-intersection-observer';
import usePosts from '../../CustomHooks/usePosts';
import PostCard from './Card/PostCard';

function Posts() {
	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		error,
	} = usePosts();

	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
		if (error) console.error(error);
	}, [inView, hasNextPage, fetchNextPage, error]);

	if (isLoading && !data) return <p>Loading...</p>;
	if (isError)
		return (
			<p className='text-red-500'>
				Failed to load posts. Please try again later.
			</p>
		);

	return (
		<div className='h-full overflow-y-auto'>
			{data?.pages.map((page) =>
				page.results.map((post) => (
					<PostCard key={post.id} post={post} />
				))
			)}

			{isFetchingNextPage && (
				<div className='flex justify-center py-4'>
					<span>Loading more posts...</span>
				</div>
			)}

			<div ref={ref} className='h-10'></div>
		</div>
	);
}

export default Posts;
