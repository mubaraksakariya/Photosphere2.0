import React, { useRef } from 'react';

const FileUploadSection = ({ file, handleFileChange, handleRemoveFile }) => {
	const fileInputRef = useRef(null);
	const isImage = file && file.type.startsWith('image/');
	const isVideo = file && file.type.startsWith('video/');

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click(); // Only call click if ref is available
		}
	};

	return (
		<div>
			{/* If there's no file selected, show the upload placeholder */}
			{!file ? (
				<div
					className='mb-4 cursor-pointer border-2 border-dashed border-gray-300 h-[400px] flex justify-center items-center text-gray-500'
					onClick={handleClick} // Use handleClick to safely trigger the file input
				>
					<span>Click to upload image/video</span>
				</div>
			) : (
				<div className='mb-4'>
					<div className='flex justify-center'>
						{/* Show file preview */}
						{isImage ? (
							<img
								src={file.preview}
								alt='Preview'
								className='max-w-full h-[390px] max-h-[400px] object-contain rounded'
							/>
						) : isVideo ? (
							<video
								controls
								className='max-w-full max-h-[400px] object-contain rounded'>
								<source src={file.preview} type='video/mp4' />
								Your browser does not support the video tag.
							</video>
						) : (
							<p className='text-red-500'>
								Unsupported file type
							</p>
						)}
					</div>
					<button
						onClick={handleRemoveFile} // Trigger file removal
						className='mt-2 text-red-500 hover:underline'>
						Remove File
					</button>
				</div>
			)}

			{/* Hidden file input field */}
			<input
				type='file'
				accept='image/*,video/*'
				onChange={handleFileChange}
				ref={fileInputRef} // Assign ref to file input
				className='hidden'
			/>
		</div>
	);
};

export default FileUploadSection;
