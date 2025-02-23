import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const toggleLike = (api, { story_id }) => {
	if (!story_id) return null;
	return api.post(`api/stories/${story_id}/like/`);
};

const useToggleStoryLike = () => {
	const api = useApi();
	return useMutation({
		mutationFn: (story_id) => toggleLike(api, { story_id }),
	});
};

export default useToggleStoryLike;
