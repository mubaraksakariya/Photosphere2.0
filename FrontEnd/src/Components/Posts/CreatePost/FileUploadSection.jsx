import React, { useRef } from 'react';

const FileUploadSection = ({ file, handleFileChange, handleRemoveFile }) => {
	const fileInputRef = useRef(null);
	const isImage = file && file.type.startsWith('image');
	const isVideo = file && file.type.startsWith('video');

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className='p-4 bg-lightMode-background dark:bg-darkMode-background rounded-md shadow-light dark:shadow-dark'>
			{/* If there's no file selected, show the upload placeholder */}
			{!file ? (
				<div
					className='mb-4 cursor-pointer border-2 border-dashed border-lightMode-textPrimary dark:border-darkMode-textPrimary h-[45vh] max-h-[70vh] flex justify-center items-center text-lightMode-textPrimary dark:text-darkMode-textPrimary transition-all'
					onClick={handleClick}>
					<span className='text-center text-lg'>
						Click to upload image/video
					</span>
				</div>
			) : (
				<div className='mb-4'>
					<div className='flex justify-center'>
						{/* Show file preview */}
						{isImage ? (
							<img
								src={file.preview}
								alt='Preview'
								className='w-full max-h-[40vh] object-contain rounded-md shadow-light dark:shadow-dark'
							/>
						) : isVideo ? (
							<video
								controls
								className='w-full max-h-[40vh] object-contain rounded-md shadow-light dark:shadow-dark'>
								<source src={file.preview} type='video/mp4' />
								Your browser does not support the video tag.
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

			{/* Hidden file input field */}
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
