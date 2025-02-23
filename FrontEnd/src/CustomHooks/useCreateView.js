import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const createStoryView = async (api, { story_id }) => {
	const response = await api.post(`api/stories/${story_id}/view/`);
	return response.data;
};

const useCreateStoryView = () => {
	const api = useApi();
	return useMutation({
		mutationFn: ({ story_id }) => createStoryView(api, { story_id }),
		onError: (error) => {
			console.error('Failed to record story view:', error);
		},
	});
};

export default useCreateStoryView;
