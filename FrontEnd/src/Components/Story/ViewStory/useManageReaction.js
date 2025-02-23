import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setStory } from '../../../Store/Slices/ModalSlice';
import useToggleStoryLike from '../../../CustomHooks/useToggleStoryLike';

const useManageReaction = () => {
	const { mutate: toggleLike } = useToggleStoryLike();
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false); // Track loading state

	const manageReaction = (storyId) => {
		if (!storyId) return;

		setIsLoading(true); // Start loading

		toggleLike(storyId, {
			onSuccess: (response) => {
				const newStory = response.data.story;

				// Update the query data for stories
				queryClient.setQueryData(['stories'], (oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							results: page.results.map((oldStory) =>
								oldStory.id === newStory.id
									? { ...oldStory, ...newStory }
									: oldStory
							),
						})),
					};
				});

				// Update the story in the Redux store
				dispatch(setStory({ story: newStory }));
			},
			onError: (error) => {
				console.error('Error toggling like:', error);
			},
			onSettled: () => {
				setIsLoading(false); // End loading
			},
		});
	};

	return { manageReaction, isLoading };
};

export default useManageReaction;
