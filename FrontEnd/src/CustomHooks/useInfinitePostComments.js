import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchPostComments = async (
	api,
	{ postId, pageParam = `/api/comments/${postId}/paginated-comments/?page=1` }
) => {
	const response = await api.get(pageParam);
	return response.data;
};

const useInfinitePostComments = (postId) => {
	const api = useApi();

	return useInfiniteQuery({
		queryKey: ['paginated-comments', postId],
		queryFn: ({ pageParam }) =>
			fetchPostComments(api, { postId, pageParam }),
		initialPageParam: `/api/comments/${postId}/paginated-comments/?page=1`,
		enabled: !!postId,
		getNextPageParam: (lastPage) => {
			// Extract relative next page URL
			if (lastPage.next) {
				const url = new URL(lastPage.next);
				const nextPagePath = url.pathname + url.search;
				return nextPagePath || undefined;
			}
			return undefined;
		},
	});
};

export default useInfinitePostComments;
