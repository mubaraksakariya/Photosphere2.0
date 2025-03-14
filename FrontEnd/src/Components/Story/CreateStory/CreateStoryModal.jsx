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
		<div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full md:h-[90dvh] h-full flex flex-col'>
				<h2 className='text-xl font-semibold mb-2 text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Create Story
				</h2>

				{/* Modal Content: Using flex to prevent overflow */}
				<div className='flex flex-col justify-between gap-4 flex-grow overflow-hidden'>
					{/* File Upload Section */}
					<div className='flex-grow'>
						<FileUploadSection
							file={file}
							handleFileChange={handleFileChange}
							handleRemoveFile={handleRemoveFile}
						/>
					</div>

					{/* Text Input Section */}
					<TextInputSection
						label='Story Caption'
						value={storyCaption}
						onChange={(e) => setStoryCaption(e.target.value)}
						placeholder='Write your story caption...'
						isTextArea={true}
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
