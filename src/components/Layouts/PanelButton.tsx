import React, { useState } from 'react';

type Props = {
  text: string;
  Icon: React.ElementType;
  col?: string;
  onClick?: () => void; // ✅ Accept onClick
};

const PanelButton: React.FC<Props> = ({ text, Icon, col, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <button
        onClick={onClick} // ✅ Use it here
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-full flex items-center md:text-[1.2vw] text-[2.2vh] font-[500] text-center md:py-[.2vw] py-[.5vh] rounded-lg text-zinc-400 transition duration-200 md:px-[1vw] cursor-pointer px-2 gap-2`}
        style={{ backgroundColor: hovered ? `#${col}` : undefined }}
      >
        <Icon className="md:size-7 text-zinc-400 size-6" />
        {text}
      </button>
    </div>
  );
};

export default PanelButton;
