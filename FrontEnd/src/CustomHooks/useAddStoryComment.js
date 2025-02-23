import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const addComment = (api, { story_id, comment }) => {
	return api.post(`api/stories/${story_id}/comments/`, { comment });
};

const useAddStoryComment = () => {
	const api = useApi();
	return useMutation({
		mutationFn: ({ story_id, comment }) =>
			addComment(api, { story_id, comment }),
	});
};

export default useAddStoryComment;
