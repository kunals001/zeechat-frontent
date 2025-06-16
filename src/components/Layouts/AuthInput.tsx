const Input = ({ ...props }) => {
	return (
		<div className='relative mb-1'>
			<input
				{...props}
				className='w-full md:px-[1vw] px-[1.5vh] md:py-2 py-[1vh] bg-opacity-50 rounded-lg border border-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400 transition duration-200 outline-none'
			/>
		</div>
	);
};
export default Input;