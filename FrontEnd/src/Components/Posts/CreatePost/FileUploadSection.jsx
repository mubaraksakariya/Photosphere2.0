import React, { useRef } from 'react';

const FileUploadSection = ({ file, handleFileChange, handleRemoveFile }) => {
	const fileInputRef = useRef(null);
	const isImage = file && file.type.startsWith('image');
	const isVideo = file && file.type.startsWith('video');

	const handleClick = () => fileInputRef.current?.click();

	return (
		<div className='p-4 flex-grow bg-lightMode-background dark:bg-darkMode-background rounded-md shadow-light dark:shadow-dark flex flex-col items-center'>
			{!file ? (
				<div
					className='cursor-pointer border-2 border-dashed border-lightMode-textPrimary dark:border-darkMode-textPrimary flex justify-center items-center text-lightMode-textPrimary dark:text-darkMode-textPrimary transition-all w-full h-[36vh] md:h-[40dvh]'
					onClick={handleClick}>
					<span className='text-center text-lg text-lightMode-textPrimary dark:text-darkMode-textPrimary'>
						Click to upload image/video
					</span>
				</div>
			) : (
				<div className='w-full'>
					<div className='flex justify-center'>
						{isImage ? (
							<img
								src={file.preview}
								alt='Preview'
								className='w-full max-h-[30vh] object-contain rounded-md shadow-light dark:shadow-dark'
							/>
						) : isVideo ? (
							<video
								controls
								className='w-full max-h-[30vh] object-contain rounded-md shadow-light dark:shadow-dark'>
								<source src={file.preview} type='video/mp4' />
							</video>
						) : (
							<p className='text-red-500 text-center'>
								Unsupported file type
							</p>
						)}
					</div>
					<button
						onClick={handleRemoveFile}
						className='mt-2 text-red-600 dark:text-red-400 hover:underline text-sm block mx-auto'>
						Remove File
					</button>
				</div>
			)}

			<input
				type='file'
				accept='image/*,video/*'
				onChange={handleFileChange}
				ref={fileInputRef}
				className='hidden'
			/>
		</div>
	);
};

export default FileUploadSection;
