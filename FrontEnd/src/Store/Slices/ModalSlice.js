import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
	isCreatePostModalOpen: false,
	isCreateStoryModalOpen: false,
	isViewStoryModalOpen: false,
	isSharePostModalOpen: false,
	story: null, // Holds the currently viewed story
	sharedPost: null, // Holds the currently shared post
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openCreatePostModal: (state) => {
			state.isCreatePostModalOpen = true;
		},
		closeCreatePostModal: (state) => {
			state.isCreatePostModalOpen = false;
		},
		openCreateStoryModal: (state) => {
			state.isCreateStoryModalOpen = true;
		},
		closeCreateStoryModal: (state) => {
			state.isCreateStoryModalOpen = false;
		},
		openViewStoryModal: (state, action) => {
			const story = action.payload?.story;
			if (story) {
				state.story = story; // Set the story only if it's valid
				state.isViewStoryModalOpen = true; // Open the modal
			}
		},
		closeViewStoryModal: (state) => {
			state.isViewStoryModalOpen = false;
			state.story = null; // Clear the story when closing the modal
		},
		setStory: (state, action) => {
			state.story = action.payload.story;
		},
		openSharePostModal: (state, action) => {
			const sharedPost = action.payload?.post;
			if (sharedPost) {
				state.sharedPost = sharedPost;
				state.isSharePostModalOpen = true;
			}
		},
		closeSharePostModal: (state) => {
			state.sharedPost = null;
			state.isSharePostModalOpen = false;
		},
	},
});

export const {
	openCreatePostModal,
	closeCreatePostModal,
	openCreateStoryModal,
	closeCreateStoryModal,
	openViewStoryModal,
	closeViewStoryModal,
	setStory,
	setSharedPost,
	openSharePostModal,
	closeSharePostModal,
} = modalSlice.actions;

export default modalSlice.reducer;
