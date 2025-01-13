import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isCreatePostModalOpen: false,
	isCreateStoryModalOpen: false,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openCreatePostModal(state) {
			state.isCreatePostModalOpen = true;
		},
		closeCreatePostModal(state) {
			state.isCreatePostModalOpen = false;
		},
		openCreateStoryModal(state) {
			state.isCreateStoryModalOpen = true;
		},
		closeCreateStoryModal(state) {
			state.isCreateStoryModalOpen = false;
		},
	},
});

export const {
	openCreatePostModal,
	closeCreatePostModal,
	openCreateStoryModal,
	closeCreateStoryModal,
} = modalSlice.actions;

export default modalSlice.reducer;
