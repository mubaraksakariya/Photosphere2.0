import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

function ConfirmBox({ message, onConfirm, onCancel }) {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-lg'>
			<div className='p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl shadow-xl border border-lightMode-border dark:border-darkMode-border w-[90%] max-w-md'>
				<div className='flex items-center gap-3 mb-4'>
					<AlertTriangle className='text-yellow-500' size={30} />
					<h3 className='text-lg font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						Confirm
					</h3>
				</div>
				<p className='text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
					{message}
				</p>
				<div className='flex justify-end gap-4 mt-6'>
					<button
						className='px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md'
						onClick={onConfirm}>
						OK
					</button>
					<button
						className='px-4 py-2 text-sm font-medium bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-all shadow-md'
						onClick={onCancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmBox;
