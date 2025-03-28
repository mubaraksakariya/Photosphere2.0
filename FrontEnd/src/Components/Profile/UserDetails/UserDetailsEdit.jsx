import React, { useState, useEffect } from 'react';
import useUserDetails from '../../../CustomHooks/useUserDetails';
import useUpdateUserDetails from '../../../CustomHooks/useUpdateUserDetails';
import LoadingRing from '../../Loading/LoadingRing';
import { validateProfileForm } from './validateProfileForm';
import { useAlert } from '../../../Contexts/AlertContext';

const UserDetailsEdit = ({ user }) => {
	const { data: userDetails, isLoading, error } = useUserDetails(user?.id);
	const { mutate: updateUserDetails, isLoading: isUpdating } =
		useUpdateUserDetails(user?.id);
	const { showSuccessAlert, showErrorAlert, showError } = useAlert();
	if (!user) {
		return (
			<div className='text-center text-lg text-red-500'>
				No user details available.
			</div>
		);
	}
	const [formState, setFormState] = useState({
		first_name: '',
		last_name: '',
		profile_image: '',
		bio: '',
		date_of_birth: '',
	});
	const [initialFormState, setInitialFormState] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');

	useEffect(() => {
		if (userDetails) {
			const { profile } = userDetails.user;
			const initialState = {
				first_name: profile?.first_name || '',
				last_name: profile?.last_name || '',
				profile_image: profile?.profile_image || '',
				bio: profile?.bio || '',
				date_of_birth: profile?.date_of_birth || '',
			};
			setFormState(initialState);
			setInitialFormState(initialState);
			setImagePreview(profile?.profile_image || '');
		}
	}, [userDetails]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setImageFile(file);
			setImagePreview(imageUrl);
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview('');
		setFormState((prevState) => ({
			...prevState,
			profile_image: '',
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (
			JSON.stringify(formState) === JSON.stringify(initialFormState) &&
			!imageFile
		) {
			showErrorAlert('No changes detected');
			return;
		}

		const result = validateProfileForm(formState, imageFile);

		if (result.errors) {
			const firstError = Object.values(result.errors)[0];
			showError(firstError);
			return;
		}
		if (formState.profile_image === '')
			result.append('remove_image', 'true');
		updateUserDetails(result, {
			onSuccess: (result) => {
				showSuccessAlert('User details updated successfully');
			},
			onError: (error) => {
				console.log(error);
				showError(error?.response?.data?.detail || error.message);
			},
		}); // `result` is FormData
	};

	if (isLoading || isUpdating) {
		return (
			<div className='flex justify-center items-center h-full'>
				<LoadingRing />
			</div>
		);
	}

	if (error) {
		return <div>Error loading user details: {error.message}</div>;
	}

	return (
		<div className=' bg-lightMode-section dark:bg-darkMode-section rounded-2xl p-5'>
			<h2 className='text-xl font-semibold text-lightMode-textPrimary dark:text-darkMode-textPrimary mb-4 text-center'>
				User Details
			</h2>
			<div className='w-full max-w-md mx-auto'>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							First Name
						</label>
						<input
							type='text'
							name='first_name'
							value={formState.first_name}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Last Name
						</label>
						<input
							type='text'
							name='last_name'
							value={formState.last_name}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Profile Image
						</label>
						<div className='flex justify-center items-center'>
							{imagePreview && (
								<div className='relative w-32 h-32 mb-2'>
									<img
										src={imagePreview}
										alt='Profile'
										className='w-full h-full object-cover rounded-md'
									/>
									<button
										type='button'
										onClick={handleRemoveImage}
										className='absolute top-0 right-0 flex justify-center items-center size-6 bg-red-500 text-white px-2 py-1 text-sm rounded-full'>
										X
									</button>
								</div>
							)}
						</div>
						<input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Bio
						</label>
						<textarea
							name='bio'
							value={formState.bio}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<div className='mb-4'>
						<label className='block text-gray-700 dark:text-gray-300'>
							Date of Birth
						</label>
						<input
							type='date'
							name='date_of_birth'
							value={formState.date_of_birth}
							onChange={handleChange}
							className='w-full p-2 border border-gray-300 rounded-md'
						/>
					</div>
					<button
						type='submit'
						className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'>
						Save
					</button>
				</form>
			</div>
		</div>
	);
};

export default UserDetailsEdit;
