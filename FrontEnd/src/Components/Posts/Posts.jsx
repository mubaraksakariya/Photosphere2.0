import React, { useState } from 'react';
import usePosts from '../../CustomHooks/usePosts';
import PostCard from './Card/PostCard';

function Posts() {
	const [pageNumber, setPageNumber] = useState(1);
	const { data, isLoading, isError } = usePosts(pageNumber);
	// console.log(data);

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading posts</p>;

	return (
		<div className='max-h-[85dvh] overflow-y-auto'>
			{data.results.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}

export default Posts;
