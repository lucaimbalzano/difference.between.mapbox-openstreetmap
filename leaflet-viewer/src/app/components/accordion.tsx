import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const PolygonAccordion = ({ currentPolygon, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const jsonString = currentPolygon
    ? JSON.stringify(currentPolygon, null, 2)
    : "No polygon retrieved yet.";

  return (
    <div className="p-4">
      <button
        onClick={toggleAccordion}
        className="flex space-x-3 items-center hover:sclae-115 hover:to-blue-400"
      >
        {title}
        <span>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-1 border-gray-300 rounded-lg">
          <pre className="text-gray-700 whitespace-pre-wrap">{jsonString}</pre>
        </div>
      </div>
    </div>
  );
};

export default PolygonAccordion;
