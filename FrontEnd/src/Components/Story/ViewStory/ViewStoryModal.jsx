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
						console.log('Story view recorded:', updatedStory);
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
			<div className='bg-lightMode-background dark:bg-darkMode-background p-4 rounded-lg shadow-light dark:shadow-dark max-w-lg w-full h-[90dvh] flex flex-col'>
				{/* Header */}
				<UserHeader
					profileImage={story.user.profile_image}
					username={story.user.username}
					email={story.user.email}
					onClose={handleClose}
				/>

				{/* Media Content */}
				<MediaContent
					mediaFile={story.media_file}
					caption={story.caption}
				/>

				{/* Interaction Section */}
				<InteractionSection story={story} />
			</div>
		</div>
	);
}

export default ViewStoryModal;
