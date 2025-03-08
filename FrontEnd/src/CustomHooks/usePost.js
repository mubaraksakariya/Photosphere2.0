import { useQuery } from '@tanstack/react-query';
import { useApi } from '../Contexts/ApiContext';

// Function to fetch post details
const fetchPost = async (api, postId) => {
	const response = await api.get(`/api/posts/${postId}`);
	return response.data;
};

// Custom hook to get post details
const usePost = (postId) => {
	const api = useApi();
	return useQuery({
		queryKey: ['post', postId],
		queryFn: () => fetchPost(api, postId),
		enabled: !!postId, // Ensure the query is enabled only if postId is provided
	});
};

export default usePost;
