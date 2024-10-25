// Checklist.js
import React, { useState } from 'react';

const Checklist = ({ items, onClose }) => {
  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  );

  const handleCheck = (item) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Checklist de Pré-Vistoria</h2>
        <ul className="mb-4">
          {items.map((item) => (
            <li key={item} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={checkedItems[item]}
                onChange={() => handleCheck(item)}
                className="mr-2"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out"
        >
          Finalizar Checklist
        </button>
      </div>
    </div>
  );
};

export default Checklist;
