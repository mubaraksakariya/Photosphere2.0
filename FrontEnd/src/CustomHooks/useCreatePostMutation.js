import { useApi } from '../Contexts/ApiContext';
import { useMutation } from '@tanstack/react-query';

const createPost = async (postData, api) => {
	const formData = new FormData();

	// Append description, hashtags, and file to FormData
	formData.append('description', postData.description);
	formData.append('hashtags', postData.hashtags);
	formData.append('media', postData.media.original); // The file is attached here
	formData.append('media_type', postData.media.type);

	const { data } = await api.post('posts/', formData, {
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
