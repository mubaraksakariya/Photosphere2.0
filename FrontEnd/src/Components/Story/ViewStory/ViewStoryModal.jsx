import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	closeViewStoryModal,
	setStory,
} from '../../../Store/Slices/ModalSlice';
import UserHeader from './UserHeader';
import MediaContent from './MediaContent';
import InteractionSection from './InteractionSection';
import useCreateStoryView from '../../../CustomHooks/useCreateView';
import useUpdateStoryCache from '../Utilities/useUpdateStoryCache';

function ViewStoryModal() {
	const dispatch = useDispatch();
	const story = useSelector((state) => state.modal.story);
	const updateStoryCache = useUpdateStoryCache();
	const { mutate: viewStory } = useCreateStoryView();

	useEffect(() => {
		if (story?.id && !story.is_viewed) {
			viewStory(
				{ story_id: story.id },
				{
					onSuccess: (response) => {
						const updatedStory = response?.story;
						if (!updatedStory) {
							console.warn(
								'No updated story data returned from API.'
							);
							return;
						}
						// Avoid redundant updates
						if (story.is_viewed !== updatedStory.is_viewed) {
							// Update cache and Redux store
							updateStoryCache(updatedStory);
							dispatch(setStory({ story: updatedStory }));
						}
					},
					onError: (error) => {
						console.error('Error recording story view:', error);
					},
				}
			);
		}
	}, [story]);

	const handleClose = () => {
		dispatch(closeViewStoryModal());
	};

	if (!story) return null;
	return (
		<div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
			<div className='relative bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full h-full md:h-[90dvh] flex flex-col overflow-y-auto'>
				{/* Header */}
				<UserHeader user={story.user} />
				<div className='absolute top-2 right-2'>
					<button
						className='text-red-600 hover:text-red-800 transition-colors text-xl shrink-0'
						onClick={handleClose}
						aria-label='Close Modal'>
						&times;
					</button>
				</div>

				{/* Media Content */}
				<MediaContent
					mediaFile={story.media_file}
					caption={story.caption}
					type={story.media_type}
				/>

				{/* Interaction Section */}
				<InteractionSection story={story} />
			</div>
		</div>
	);
}

export default ViewStoryModal;
