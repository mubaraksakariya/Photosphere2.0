import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

function SuccessBox({ message, onConfirm }) {
	const [count, setCount] = useState(5);

	useEffect(() => {
		const countdown = setInterval(() => {
			setCount((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					onConfirm(); // Call onConfirm when countdown reaches 0
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(countdown); // Cleanup on unmount
	}, [onConfirm]);

	return (
		<div className='fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-lg'>
			<div className='p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl shadow-xl border border-lightMode-border dark:border-darkMode-border w-[90%] max-w-md'>
				<div className='flex items-center gap-3 mb-4'>
					<CheckCircle className='text-green-500' size={30} />
					<h3 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						Success
					</h3>
				</div>
				<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					{message}
				</p>
				<div className='flex justify-end gap-4 mt-6'>
					<button
						className='px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-md'
						onClick={onConfirm}>
						OK ({count})
					</button>
				</div>
			</div>
		</div>
	);
}

export default SuccessBox;
