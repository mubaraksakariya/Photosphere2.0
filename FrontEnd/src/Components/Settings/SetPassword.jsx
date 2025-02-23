import React, { useState } from 'react';
import Button from '../Ui/Button';
import Input from '../Ui/Input';
import useSetPasswordMutation from '../../CustomHooks/useSetPasswordMutation';
import { validatePassword } from './utils/validators';
import { useDispatch } from 'react-redux';
import { useAlert } from '../../Contexts/AlertContext';
import { logout } from '../../Store/Slices/AuthSlice';

const SetPassword = () => {
	const { mutate, isPending, isError, error } = useSetPasswordMutation();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [localError, setLocalError] = useState('');
	const { showSuccess } = useAlert();
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		setLocalError('');

		// Validate password
		const errorMsg = validatePassword(password, confirmPassword);
		if (errorMsg) {
			setLocalError(errorMsg);
			return;
		}

		// Call the mutation
		mutate(
			{ new_password: password, confirm_password: confirmPassword },
			{
				onSuccess: (response) => {
					showSuccess('password changed successfully', () =>
						dispatch(logout())
					);
				},
			}
		);
	};

	// Extract API error message
	const apiError = error?.response?.data?.error || 'Something went wrong.';

	return (
		<form onSubmit={handleSubmit} className='space-y-3'>
			<Input
				type='password'
				placeholder='New Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Input
				type='password'
				placeholder='Confirm Password'
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
			/>

			{/* Show validation errors */}
			{localError && <p className='text-red-500 text-sm'>{localError}</p>}
			{isError && <p className='text-red-500 text-sm'>{apiError}</p>}

			<Button type='submit' disabled={isPending}>
				{isPending ? 'Setting Password...' : 'Set Password'}
			</Button>
		</form>
	);
};

export default SetPassword;
