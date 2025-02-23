import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeCreatePostModal } from '../../../Store/Slices/ModalSlice';
import FileUploadSection from './FileUploadSection';
import TextInputSection from './TextInputSection';
import SubmitSection from './SubmitSection';
import useFileUpload from './useFileUpload';
import { useCreatePostMutation } from '../../../CustomHooks/useCreatePostMutation';

function CreatePostModal() {
	const dispatch = useDispatch();
	const { file, handleFileChange, handleRemoveFile } = useFileUpload();
	const [description, setDescription] = useState('');
	const [hashtags, setHashtags] = useState('');

	const { mutate } = useCreatePostMutation();

	const handleSubmit = (e) => {
		e.preventDefault();
		const postData = {
			description,
			hashtags: hashtags.split(' ').map((tag) => tag.trim()),
			media: file,
		};

		mutate(postData, {
			onSuccess: (data) => {
				console.log('Post created successfully', data);
				dispatch(closeCreatePostModal());
			},
			onError: (e) => {
				console.log('Error creating post', e);
			},
		});
	};

	return (
		<div className='fixed inset-0 bg-lightMode-shadow dark:bg-darkMode-shadow bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full h-[95vh]'>
				<h2 className='text-xl font-semibold mb-1 text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Create Post
				</h2>

				<div className='flex flex-col justify-between gap-4 h-[97%]'>
					<FileUploadSection
						file={file}
						handleFileChange={handleFileChange}
						handleRemoveFile={handleRemoveFile}
					/>
					<div>
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
		</div>
	);
}

export default CreatePostModal;
