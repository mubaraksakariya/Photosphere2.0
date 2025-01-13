import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import CreatePostModal from '../Components/Posts/CreatePost/CreatePostModal';
import CreateStoryModal from '../Components/Story/CreateStory/CreateStoryModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
	const { isCreatePostModalOpen, isCreateStoryModalOpen } = useSelector(
		(state) => state.modal
	);

	return (
		<ModalContext.Provider value={{}}>
			{children}
			{isCreatePostModalOpen && <CreatePostModal />}
			{isCreateStoryModalOpen && <CreateStoryModal />}
		</ModalContext.Provider>
	);
};

export const useModal = () => useContext(ModalContext);
