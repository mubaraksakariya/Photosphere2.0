import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const toggleLike = (api, postId) => {
	return api.post(`api/likes/${postId}/toggle/`);
};

const useToggleLike = () => {
	const api = useApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (postId) => toggleLike(api, postId),

		onError: (error, variables, context) => {
			// Rollback the optimistic update
		},
		onSuccess: (response, variables) => {
			const updatedPost = response.data.post;
			const postId = variables;

			// Update the specific post in the cache
			queryClient.setQueryData(['post', String(postId)], (oldData) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					...updatedPost,
				};
			});

			// Update the posts list in the cache
			queryClient.setQueryData(['posts'], (oldData) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					pages: oldData.pages.map((page) => ({
						...page,
						results: page.results.map((p) =>
							p.id === updatedPost.id ? updatedPost : p
						),
					})),
				};
			});
		},
	});
};

export default useToggleLike;
