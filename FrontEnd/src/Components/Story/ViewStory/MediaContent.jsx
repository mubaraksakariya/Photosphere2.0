const MediaContent = ({ mediaFile, caption }) => (
	<div className='relative mb-4 max-h-[85%] w-fit m-auto flex-grow'>
		<img
			src={mediaFile}
			alt={caption}
			className='w-full h-full object-contain rounded-lg'
		/>
		<div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg'>
			<p className='text-sm mb-2 text-center'>{caption}</p>
		</div>
	</div>
);

export default MediaContent;
