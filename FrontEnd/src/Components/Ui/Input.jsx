const Input = ({ className = '', ...props }) => (
	<input
		className={`w-full p-3 border rounded-lg bg-lightMode-background dark:bg-darkMode-background border-gray-300 dark:border-gray-600 ${className}`}
		{...props}
	/>
);
export default Input;
