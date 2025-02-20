import { createContext, useContext, useState } from 'react';
import ErrorAlert from '../Components/Alert/ErrorAlert';
import SuccessAlert from '../Components/Alert/SuccessAlert';
import ConfirmBox from '../Components/Alert/ConfirmBox';
import ErrorBox from '../Components/Alert/ErrorBox';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
	const [alertData, setAlertData] = useState(null);
	const [confirmData, setConfirmData] = useState(null);

	// Success Alert (Auto Disappears)
	const showSuccessAlert = (message) => {
		setAlertData({ message, type: 'success' });
		setTimeout(() => setAlertData(null), 3000);
	};

	// Error Alert (Auto Disappears)
	const showErrorAlert = (message) => {
		setAlertData({ message, type: 'error' });
		setTimeout(() => setAlertData(null), 3000);
	};

	// Success Confirm (OK/Cancel)
	const showConfirm = (message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'success', onConfirm, onCancel });
	};

	// Error Confirm (OK/Cancel)
	const showError = (message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'error', onConfirm, onCancel });
	};

	// Handle Confirm Action
	const handleConfirm = () => {
		if (confirmData?.onConfirm) confirmData.onConfirm();
		setConfirmData(null);
	};

	// Handle Cancel
	const handleCancel = () => {
		if (confirmData?.onCancel) confirmData.onCancel();
		setConfirmData(null);
	};

	return (
		<AlertContext.Provider
			value={{
				showSuccessAlert,
				showErrorAlert,
				showConfirm,
				showError,
			}}>
			{children}

			{/* Alerts */}
			{alertData && alertData.type === 'success' && (
				<SuccessAlert message={alertData.message} />
			)}
			{alertData && alertData.type === 'error' && (
				<ErrorAlert message={alertData.message} />
			)}

			{/* Confirm Boxes */}
			{confirmData && confirmData.type === 'success' && (
				<ConfirmBox
					message={confirmData.message}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
			{confirmData && confirmData.type === 'error' && (
				<ErrorBox
					message={confirmData.message}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
