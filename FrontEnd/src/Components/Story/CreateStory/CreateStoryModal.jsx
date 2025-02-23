import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeCreateStoryModal } from '../../../Store/Slices/ModalSlice';
import useFileUpload from '../../Posts/CreatePost/useFileUpload';
import TextInputSection from '../../Posts/CreatePost/TextInputSection';
import SubmitSection from '../../Posts/CreatePost/SubmitSection';
import FileUploadSection from '../../Posts/CreatePost/FileUploadSection';
import { useCreatePostMutation } from '../../../CustomHooks/useCreateStoryMutation';

function CreateStoryModal() {
	const dispatch = useDispatch();
	const { file, handleFileChange, handleRemoveFile } = useFileUpload();
	const [storyCaption, setStoryCaption] = useState('');
	const { mutate, isError, isSuccess } = useCreatePostMutation();

	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation: Ensure file is selected
		if (!file) {
			console.error(
				'Please upload a media file before submitting the story.'
			);
			return;
		}

		// Prepare data and mutate
		const data = { caption: storyCaption, media: file };
		mutate(data);

		// Close modal on submit
		dispatch(closeCreateStoryModal());
	};

	return (
		<div className='fixed inset-0 bg-lightMode-shadow dark:bg-darkMode-shadow bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full h-[95vh]'>
				<h2 className='text-xl font-semibold mb-1 text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Create Story
				</h2>

				<div className='flex flex-col justify-between gap-4 h-[97%]'>
					{/* File Upload Section */}
					<FileUploadSection
						file={file}
						handleFileChange={handleFileChange}
						handleRemoveFile={handleRemoveFile}
					/>

					{/* Text Input Section */}
					<TextInputSection
						label='Story Caption'
						value={storyCaption} // Use the correct state variable
						onChange={(e) => setStoryCaption(e.target.value)}
						placeholder='Write your story caption...'
						isTextArea={true} // For multiline input
					/>

					{/* Submit Section */}
					<SubmitSection
						onSubmit={handleSubmit}
						onCancel={() => dispatch(closeCreateStoryModal())}
					/>

					{/* Feedback for Success/Error */}
					{isSuccess && (
						<p className='text-green-500 text-center'>
							Story created successfully!
						</p>
					)}
					{isError && (
						<p className='text-red-500 text-center'>
							An error occurred while creating the story. Please
							try again.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default CreateStoryModal;
