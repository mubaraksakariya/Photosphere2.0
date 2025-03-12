import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const createPost = async (postData, api) => {
	console.log(postData.media.type);
	const formData = new FormData();

	// Append description, hashtags, and file to FormData
	formData.append('caption', postData.caption);
	formData.append('media_file', postData.media.original);
	formData.append('media_type', postData.media.type);

	const { data } = await api.post('api/stories/', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return data;
};

export const useCreatePostMutation = () => {
	const api = useApi();

	return useMutation({
		mutationFn: (postData) => createPost(postData, api),
		onSuccess: (response) => {
			console.log('Post created successfully');
			console.log(response);
		},
		onError: (error) => {
			console.error(
				'Error creating post:',
				error.response?.data?.detail || error
			);
		},
	});
};
