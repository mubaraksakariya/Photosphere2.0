import React from 'react';
import PostPageMobile from './PostPageMobile';
import PostPageDesktop from './PostPageDesktop';

function PostPage() {
	return (
		<>
			<div className='hidden md:block'>
				<PostPageDesktop />
			</div>
			<div className='md:hidden'>
				<PostPageMobile />
			</div>
		</>
	);
}

export default PostPage;
