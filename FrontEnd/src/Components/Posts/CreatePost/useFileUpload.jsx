import { useState } from 'react';

const useFileUpload = () => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];

		if (selectedFile) {
			const fileType = selectedFile.type.split('/')[0];
			const preview = URL.createObjectURL(selectedFile);

			setFile({
				preview,
				type: fileType,
				original: selectedFile,
			});
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
	};

	return { file, handleFileChange, handleRemoveFile };
};

export default useFileUpload;
