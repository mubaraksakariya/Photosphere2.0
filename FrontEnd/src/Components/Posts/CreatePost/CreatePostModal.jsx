import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeCreatePostModal } from '../../../Store/Slices/ModalSlice';
import FileUploadSection from './FileUploadSection';
import TextInputSection from './TextInputSection';
import SubmitSection from './SubmitSection';
import useFileUpload from './useFileUpload';

function CreatePostModal() {
	const dispatch = useDispatch();
	const { file, handleFileChange, handleRemoveFile } = useFileUpload();
	const [description, setDescription] = useState('');
	const [hashtags, setHashtags] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic
		console.log({ description, hashtags, file });
		dispatch(closeCreatePostModal());
	};

	return (
		<div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full h-[95vh]'>
				<h2 className='text-2xl font-semibold mb-4 text-center'>
					Create Post
				</h2>

				<div className='flex flex-col justify-between gap-2 h-[95%]'>
					<FileUploadSection
						file={file}
						handleFileChange={handleFileChange}
						handleRemoveFile={handleRemoveFile}
					/>

					<TextInputSection
						label='Description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Write a description...'
						isTextArea={true}
					/>

					<TextInputSection
						label='Hashtags'
						value={hashtags}
						onChange={(e) => setHashtags(e.target.value)}
						placeholder='#hashtag1 #hashtag2'
					/>

					<SubmitSection
						onSubmit={handleSubmit}
						onCancel={() => dispatch(closeCreatePostModal())}
					/>
				</div>
			</div>
		</div>
	);
}

export default CreatePostModal;
