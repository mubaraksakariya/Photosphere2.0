import React from 'react';
import { useDispatch } from 'react-redux';
import { closeCreateStoryModal } from '../../../Store/Slices/ModalSlice';

function CreateStoryModal() {
	const dispatch = useDispatch();

	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				<h2>Create Story</h2>
				{/* Add story creation form here */}
				<button onClick={() => dispatch(closeCreateStoryModal())}>
					Close
				</button>
			</div>
		</div>
	);
}

export default CreateStoryModal;
