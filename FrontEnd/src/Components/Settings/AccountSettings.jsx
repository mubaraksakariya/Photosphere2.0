import React from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react'; // Icons
import Button from '../Ui/Button';
import Label from '../Ui/Label';
import Input from '../Ui/Input';

const AccountSettings = ({ currentUser }) => {
	console.log(currentUser);

	return (
		<section className='space-y-6 p-6 bg-lightMode-section dark:bg-darkMode-section rounded-2xl max-w-3xl mx-auto'>
			<h2 className='text-2xl font-bold text-lightMode-textPrimary dark:text-darkMode-textPrimary text-center'>
				Account Settings
			</h2>

			{/* Change Email */}
			{/* <div className='space-y-3'>
				<Label htmlFor='email'>Change Email</Label>
				<div className='flex items-center gap-3'>
					<Input
						type='email'
						id='email'
						placeholder='Enter new email'
					/>
					<Button variant='outline'>Update</Button>
				</div>
			</div> */}

			{/* Change Password */}
			<div className='space-y-3'>
				<Label htmlFor='password'>Change Password</Label>
				<div className='grid gap-3'>
					<Input
						type='password'
						id='current-password'
						placeholder='Current password'
					/>
					<Input
						type='password'
						id='new-password'
						placeholder='New password'
					/>
					<Input
						type='password'
						id='confirm-password'
						placeholder='Confirm new password'
					/>
					<Button>Update Password</Button>
				</div>
			</div>

			{/* Two-Factor Authentication */}
			{/* <div className='flex items-center justify-between p-4 border border-lightMode-textPrimary dark:border-darkMode-textPrimary rounded-lg'>
				<div className='flex items-center gap-2'>
					<ShieldCheck size={20} className='text-blue-500' />
					<p className='text-sm text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						Enable Two-Factor Authentication
					</p>
				</div>
				<Button variant='outline'>Enable</Button>
			</div> */}

			{/* Delete Account */}
			<div className='border-t pt-4 border-lightMode-textPrimary dark:border-darkMode-textPrimary'>
				<p className='text-sm text-red-500 flex items-center gap-2'>
					<Trash2 size={18} /> Delete Account
				</p>
				<p className='text-xs text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					This action is irreversible. All your data will be
					permanently deleted.
				</p>
				<Button variant='destructive' className='mt-2'>
					Delete Account
				</Button>
			</div>
		</section>
	);
};

export default AccountSettings;
