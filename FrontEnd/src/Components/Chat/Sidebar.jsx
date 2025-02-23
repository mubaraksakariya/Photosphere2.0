// Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router';

function Sidebar() {
	const navigate = useNavigate();
	return (
		<div className='flex flex-col items-center py-4 space-y-4'>
			<div
				className='w-10 h-10 bg-lightMode-highlight dark:bg-darkMode-highlight rounded-full cursor-pointer'
				onClick={() => navigate('/')}>
				<img className=' p-1' src='./logo.png' alt='' />
			</div>
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
