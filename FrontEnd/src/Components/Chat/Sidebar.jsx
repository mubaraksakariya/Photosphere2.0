// Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router';
import { Settings } from 'lucide-react';

function Sidebar() {
	const navigate = useNavigate();
	return (
		<div className='flex  md:flex-col items-center justify-between px-2 md:px-0 py-2 md:py-4 md:space-y-5 w-full'>
			<div
				className='w-10 h-10  cursor-pointer'
				onClick={() => navigate('/')}>
				<img className='p-1 text-black ' src='./logo.png' alt='' />
			</div>
			<div
				className='w-10 h-10 bg-lightMode-highlight dark:bg-darkMode-highlight rounded-full cursor-pointer flex justify-center items-center'
				onClick={() => navigate('/chat/settings')}>
				<Settings absoluteStrokeWidth />
			</div>
			{/* Placeholder icons */}
			{[...Array(3)].map((_, index) => (
				<div
					key={index}
					className='w-10 h-10 bg-lightMode-highlight dark:bg-darkMode-highlight rounded-full cursor-pointer'></div>
			))}
		</div>
	);
}

export default Sidebar;
