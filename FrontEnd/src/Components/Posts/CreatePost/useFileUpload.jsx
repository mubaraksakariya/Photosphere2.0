import { useState } from 'react';

const useFileUpload = () => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile({
				preview: URL.createObjectURL(selectedFile),
				type: selectedFile.type,
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
