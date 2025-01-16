import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeCreateStoryModal } from '../../../Store/Slices/ModalSlice';
import useFileUpload from '../../Posts/CreatePost/useFileUpload';
import TextInputSection from '../../Posts/CreatePost/TextInputSection';
import SubmitSection from '../../Posts/CreatePost/SubmitSection';
import FileUploadSection from '../../Posts/CreatePost/FileUploadSection';

function CreateStoryModal() {
	const dispatch = useDispatch();
	const { file, handleFileChange, handleRemoveFile } = useFileUpload();
	const [storyText, setStoryText] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle story submission (API call, etc.)
		console.log('Story submitted:', { text: storyText, media: file });
		dispatch(closeCreateStoryModal());
	};

	return (
		<div className='fixed inset-0 bg-lightMode-shadow dark:bg-darkMode-shadow bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full h-[95vh]'>
				<h2 className='text-xl font-semibold mb-1 text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Create Story
				</h2>

				<div className='flex flex-col justify-between gap-4 h-[97%]'>
					<FileUploadSection
						file={file}
						handleFileChange={handleFileChange}
						handleRemoveFile={handleRemoveFile}
					/>
					<TextInputSection
						label='Story Text'
						value={storyText}
						onChange={(e) => setStoryText(e.target.value)}
						placeholder='Write your story...'
						isTextArea={true} // Important for multiline input
					/>
					{/* Submit Section */}
					<SubmitSection
						onSubmit={handleSubmit}
						onCancel={() => dispatch(closeCreateStoryModal())}
					/>
				</div>
			</div>
		</div>
	);
}

export default CreateStoryModal;
