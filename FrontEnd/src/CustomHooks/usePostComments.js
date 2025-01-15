import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchPostComments = async (api, postId) => {
	const { data } = await api.get(`/comments/${postId}/recent-post-comments`);
	return data;
};

const usePostComments = (postId) => {
	const api = useApi();

	return useQuery({
		queryKey: ['comments', postId],
		queryFn: () => fetchPostComments(api, postId),
		staleTime: 1000 * 60 * 5,
		enabled: !!postId,
	});
};

export default usePostComments;
