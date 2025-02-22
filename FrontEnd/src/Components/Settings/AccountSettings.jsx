import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../Ui/Button';
import ChangePassword from './ChangePassword';
import ResetPassword from './ResetPassword';
import SetPassword from './SetPassword';

const AccountSettings = ({ currentUser }) => {
	const isOAuthUser = currentUser?.auth_provider !== 'email';

	return (
		<section className='p-8 bg-lightMode-section dark:bg-darkMode-section rounded-2xl max-w-3xl mx-auto overflow-auto'>
			<h2 className='text-3xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary text-center mb-8'>
				Account Settings
			</h2>

			{/* Password Management */}
			<div className='bg-lightMode-card dark:bg-darkMode-card p-6 rounded-xl'>
				<h3 className='text-xl text-center font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4'>
					Security & Password
				</h3>

				{isOAuthUser ? (
					<div className='text-center text-sm text-lightMode-textSecondary dark:text-darkMode-textSecondary'>
						<p className='mb-3'>
							You signed in with {currentUser.auth_provider}.
						</p>
						<SetPassword />
					</div>
				) : (
					<ChangePassword />
				)}

				{/* Separator */}
				<div className='border-t border-lightMode-border dark:border-darkMode-border my-6'></div>

				{/* Reset Password */}
				{!isOAuthUser && <ResetPassword />}
			</div>

			{/* Separator */}
			<div className='border-t border-lightMode-border dark:border-darkMode-border my-8'></div>

			{/* Delete Account */}
			<div className='bg-lightMode-section dark:bg-darkMode-section p-4 rounded-xl opacity-80 hover:opacity-100 transition-opacity'>
				<h3 className='text-md font-medium text-red-600 dark:text-red-400 flex items-center gap-2'>
					<Trash2 size={18} /> Delete Account
				</h3>
				<p className='text-xs text-lightMode-textSecondary dark:text-darkMode-textSecondary mt-1'>
					This action is{' '}
					<span className='font-semibold'>irreversible</span>. All
					your data will be permanently deleted.
				</p>
				<Button
					variant='destructive'
					className='mt-2 w-auto px-4 py-1 text-xs font-medium opacity-80 hover:opacity-100'>
					Delete
				</Button>
			</div>
		</section>
	);
};

export default AccountSettings;
