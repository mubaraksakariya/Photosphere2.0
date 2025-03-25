import React from 'react';
import LeftNav from '../../Components/Home/LeftNav/LeftNav';
import Posts from '../../Components/Posts/Posts';
import RightNav from '../../Components/Home/RightNav/RightNav';
import TopNav from '../../Components/Home/TopNav/TopNav';

function Home() {
	return (
		<div className='min-h-[100dvh] bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary flex flex-col'>
			{/* Top Nav */}
			<div className='md:px-6 lg:px-8 px-0 pb-0'>
				<TopNav />
			</div>

			{/* Main Content */}
			<div className='flex flex-1 flex-col md:flex-row gap-4 pt-4 md:px-6 lg:px-8 pb-0 max-h-[85dvh] overflow-y-auto'>
				{/* Left Navigation - Hidden on smaller screens */}
				<div className='md:flex-[1] hidden md:flex justify-center bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg p-3'>
					<LeftNav />
				</div>

				{/* Posts Section - Always Scrollable */}
				<div className='md:flex-[4] flex-1 bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark rounded-lg'>
					<Posts />
				</div>

				{/* Right Navigation - Hidden on smaller screens */}
				<div className='md:flex-[1] hidden lg:flex bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-4 rounded-lg'>
					<RightNav />
				</div>
			</div>
			{/* Left Navigation at Bottom on Small Screens */}
			<div className='md:hidden fixed bottom-0 left-0 w-full bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-3 border-t'>
				<LeftNav />
			</div>
		</div>
	);
}

export default Home;
