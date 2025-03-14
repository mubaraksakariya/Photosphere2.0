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
			onSuccess: () => dispatch(closeCreatePostModal()),
			onError: (e) => console.error('Error creating post:', e),
		});
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark w-full max-w-lg h-screen md:h-[90dvh] flex flex-col justify-between'>
				<h2 className='text-xl font-semibold text-center text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
					Create Post
				</h2>

				{/* Container with flexible height distribution */}
				<div className='flex flex-col gap-1 flex-grow overflow-hidden'>
					<FileUploadSection
						file={file}
						handleFileChange={handleFileChange}
						handleRemoveFile={handleRemoveFile}
					/>
					<div className='flex flex-col gap-2 flex-grow'>
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
					</div>

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
