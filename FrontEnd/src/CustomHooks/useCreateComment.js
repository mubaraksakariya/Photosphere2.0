import { useMutation } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const writeComment = (api, { post_id, comment }) => {
	return api.post('comments/write/', { post_id, comment });
};

const useCreateComment = () => {
	const api = useApi();
	return useMutation({
		mutationFn: ({ post_id, comment }) =>
			writeComment(api, { post_id, comment }),
	});
};

export default useCreateComment;
