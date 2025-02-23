import { useInfiniteQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

const fetchMessages = async (
	api,
	chatRoomId,
	{ pageParam = `/chat/${chatRoomId}/messages/?page=1` }
) => {
	const response = await api.get(pageParam);
	return response.data;
};

const useMessages = (chatRoomId) => {
	const api = useApi();

	return useInfiniteQuery({
		queryKey: ['messages', chatRoomId],
		queryFn: ({ pageParam = `/chat/${chatRoomId}/messages/?page=1` }) =>
			fetchMessages(api, chatRoomId, { pageParam }),

		initialPageParam: `/chat/${chatRoomId}/messages/?page=1`,
		getNextPageParam: (lastPage) => {
			// Extract only the part after the base URL (i.e., the path and query)
			const nextPageUrl = lastPage.next;
			if (nextPageUrl) {
				const url = new URL(nextPageUrl);
				const nextPagePath = url.pathname + url.search;
				return nextPagePath || undefined;
			}
			return undefined;
		},
		enabled: !!chatRoomId,
	});
};

export default useMessages;
