const Label = ({ children, className = '', ...props }) => (
	<label
		className={`block font-medium text-lightMode-textPrimary dark:text-darkMode-textPrimary ${className}`}
		{...props}>
		{children}
	</label>
);
export default Label;
