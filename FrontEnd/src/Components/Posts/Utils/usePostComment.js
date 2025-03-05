import { useQueryClient } from '@tanstack/react-query';
import useCreateComment from '../../../CustomHooks/useCreateComment';

export const usePostComment = () => {
	const { mutate, isPending, error } = useCreateComment();
	const queryClient = useQueryClient();

	const postComment = (
		post,
		comment,
		onComplete = null,
		onFailure = null
	) => {
		const data = {
			post_id: post.id,
			comment: comment,
		};

		mutate(data, {
			onSuccess: (response) => {
				console.log(response.data);
				const newComment = response.data.new_comment;

				queryClient.setQueryData(
					['paginated-comments', post?.id],
					(oldData) => {
						if (!oldData) return oldData;

						return {
							...oldData,
							pages: oldData.pages.map((page, index) =>
								index === 0
									? {
											...page,
											results: [
												newComment,
												...page.results,
											],
									  }
									: page
							),
						};
					}
				);

				if (onComplete) onComplete(newComment);
			},
			onError: (error) => {
				if (onFailure) onFailure(error);
				else console.error(error);
			},
		});
	};

	return { postComment, isPending, error };
};
