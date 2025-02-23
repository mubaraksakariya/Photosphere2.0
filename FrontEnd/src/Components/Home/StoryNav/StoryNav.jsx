import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useStories from '../../../CustomHooks/useStories';
import CreateStoryBtn from './CreateStoryBtn';
import StoryButton from './StoryButton';

function StoryNav() {
	const {
		data,
		isLoading,
		isError,
		hasNextPage,
		error,
		isFetchingNextPage,
		fetchNextPage,
	} = useStories();

	const { ref, inView } = useInView();

	// Fetch next page when inView and more pages are available
	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	if (isLoading) return <p>Loading stories...</p>;
	if (isError) return <p>Error loading stories: {error?.message}</p>;

	return (
		<div className='flex gap-3 items-center'>
			<CreateStoryBtn />
			<div className='overflow-x-auto'>
				<div className='flex gap-3 items-center'>
					{data.pages.map((page, pageIndex) => (
						<React.Fragment key={pageIndex}>
							{page.results.map((story) => (
								<StoryButton key={story.id} story={story} />
							))}
						</React.Fragment>
					))}
					{isFetchingNextPage && (
						<div className='flex justify-center py-4'>
							<span>Loading more stories...</span>
						</div>
					)}
					{/* Invisible element to trigger fetching next page */}
					<div ref={ref} className='h-10'></div>
				</div>
			</div>
		</div>
	);
}

export default StoryNav;
