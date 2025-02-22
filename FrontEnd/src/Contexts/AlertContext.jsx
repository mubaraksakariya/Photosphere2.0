import { createContext, useContext, useState } from 'react';
import ErrorAlert from '../Components/Alert/ErrorAlert';
import SuccessAlert from '../Components/Alert/SuccessAlert';
import ConfirmBox from '../Components/Alert/ConfirmBox';
import ErrorBox from '../Components/Alert/ErrorBox';
import SuccessBox from '../Components/Alert/SuccessBox';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
	const [alertData, setAlertData] = useState(null);
	const [confirmData, setConfirmData] = useState(null);
	const [successData, setSuccessData] = useState(null);

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

	// Success Modal (OK Button)
	const showSuccess = (message, onConfirm) => {
		setSuccessData({ message, onConfirm });
	};

	// Confirm Modal (OK/Cancel)
	const showConfirm = (message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'confirm', onConfirm, onCancel });
	};

	// Error Modal (OK/Cancel)
	const showError = (message, onConfirm, onCancel = null) => {
		setConfirmData({ message, type: 'error', onConfirm, onCancel });
	};

	// Handle Confirm Action
	const handleConfirm = () => {
		if (confirmData?.onConfirm) confirmData.onConfirm();
		if (successData?.onConfirm) successData.onConfirm();
		setConfirmData(null);
		setSuccessData(null);
	};

	// Handle Cancel Action
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
				showSuccess,
			}}>
			{children}

			{/* Alerts */}
			{alertData?.type === 'success' && (
				<SuccessAlert message={alertData.message} />
			)}
			{alertData?.type === 'error' && (
				<ErrorAlert message={alertData.message} />
			)}

			{/* Confirm Boxes */}
			{confirmData &&
				(confirmData.type === 'confirm' ? (
					<ConfirmBox
						message={confirmData.message}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>
				) : (
					<ErrorBox
						message={confirmData.message}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>
				))}

			{/* Success Box */}
			{successData && (
				<SuccessBox
					message={successData.message}
					onConfirm={handleConfirm}
				/>
			)}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
