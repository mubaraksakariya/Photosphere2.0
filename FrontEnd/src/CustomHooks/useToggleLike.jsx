import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const toggleLike = (api, postId) => {
	return api.post(`/likes/${postId}/toggle/`);
};

const useToggleLike = () => {
	const api = useApi();
	return useMutation({
		mutationFn: (postId) => toggleLike(api, postId),
		onMutate: () => {
			// Optimistically update the UI
		},
		onError: (error, variables, context) => {
			// Rollback the optimistic update
		},
		onSettled: (data, error, variables, context) => {
			// Update the UI
		},
	});
};

export default useToggleLike;
