import React from 'react';
import LeftNav from '../../Components/Home/LeftNav/LeftNav';
import Posts from '../../Components/Posts/Posts';

function Home() {
	return (
		<div className='min-h-screen flex flex-col bg-lightMode-background dark:bg-darkMode-background text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
			{/* Story Nav */}
			<div className='bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark py-4 px-6'>
				<div className='text-lightMode-accent dark:text-darkMode-accent font-semibold'>
					Story Nav
				</div>
			</div>

			{/* Main Content */}
			<div className='flex flex-1 gap-4 p-4 md:p-6 lg:p-8'>
				{/* Left Navigation */}
				<div className='flex-[1] hidden md:block bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-4 rounded-lg'>
					<LeftNav />
				</div>

				{/* Posts Section */}
				<div className='flex-[4] bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-4 rounded-lg '>
					<Posts />
				</div>

				{/* Right Navigation */}
				<div className='flex-[1] hidden lg:block bg-lightMode-section dark:bg-darkMode-section shadow-light dark:shadow-dark p-4 rounded-lg'>
					<div className='font-medium'>Right Nav</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
