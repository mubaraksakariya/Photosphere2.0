// Sidebar.jsx
import React from 'react';

function Sidebar() {
	return (
		<div className='flex flex-col items-center py-4 space-y-4'>
			{/* Placeholder icons */}
			{[...Array(4)].map((_, index) => (
				<div
					key={index}
					className='w-10 h-10 bg-lightMode-highlight dark:bg-darkMode-highlight rounded-full'></div>
			))}
		</div>
	);
}

export default Sidebar;
