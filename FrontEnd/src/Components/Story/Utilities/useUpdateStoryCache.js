import { useQueryClient } from '@tanstack/react-query';

const useUpdateStoryCache = () => {
	const queryClient = useQueryClient();

	// Function to update the query cache
	const updateStoryCache = (newStory) => {
		if (!newStory?.id) {
			console.error("Invalid story object: 'id' is missing.");
			return;
		}

		// Update the query data for 'stories'
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
	};

	return updateStoryCache;
};

export default useUpdateStoryCache;
