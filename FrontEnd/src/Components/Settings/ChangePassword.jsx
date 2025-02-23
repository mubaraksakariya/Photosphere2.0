import React, { useState } from 'react';
import Input from '../Ui/Input';
import Button from '../Ui/Button';
import Label from '../Ui/Label';
import useChangePasswordMutation from '../../CustomHooks/useChangePasswordMutation';
import { validatePassword } from './utils/validators';
import { useAlert } from '../../Contexts/AlertContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Slices/AuthSlice';

const ChangePassword = () => {
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [error, setError] = useState(null);
	const [localError, setLocalError] = useState('');
	const { showSuccess } = useAlert();
	const dispatch = useDispatch();

	const { mutate, isLoading } = useChangePasswordMutation();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
		setError(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLocalError('');

		const { currentPassword, newPassword, confirmPassword } = formData;

		// Validate password
		const errorMsg = validatePassword(newPassword, confirmPassword);
		if (errorMsg) {
			setLocalError(errorMsg);
			return;
		}

		mutate(
			{ old_password: currentPassword, new_password: newPassword },
			{
				onSuccess: () => {
					setFormData({
						currentPassword: '',
						newPassword: '',
						confirmPassword: '',
					});
					showSuccess('password changed successfully', () =>
						dispatch(logout())
					);
				},
				onError: (err) => {
					if (err.response.data) setError(err.response.data);
					else
						setError({
							general: 'something wernt wrong, try again later',
						});
				},
			}
		);
	};

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-center'>
				Change Password
			</h3>

			{error && (
				<p className='text-red-500 text-sm text-center'>
					{error.general}
				</p>
			)}

			<form onSubmit={handleSubmit} className='grid gap-3'>
				<Label htmlFor='currentPassword'>Current Password</Label>
				<Input
					type='password'
					id='currentPassword'
					placeholder='Current password'
					value={formData.currentPassword}
					onChange={handleChange}
				/>
				<p className='text-red-500 text-sm text-center'>
					{error?.old_password}
				</p>
				<Label htmlFor='newPassword'>New Password</Label>
				<Input
					type='password'
					id='newPassword'
					placeholder='New password'
					value={formData.newPassword}
					onChange={handleChange}
				/>
				<p className='text-red-500 text-sm text-center'>
					{error?.new_password}
				</p>
				<Label htmlFor='confirmPassword'>Confirm New Password</Label>
				<Input
					type='password'
					id='confirmPassword'
					placeholder='Confirm new password'
					value={formData.confirmPassword}
					onChange={handleChange}
				/>
				<p className='text-red-500 text-sm text-center'>{localError}</p>
				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Updating...' : 'Update Password'}
				</Button>
			</form>
		</div>
	);
};

export default ChangePassword;
