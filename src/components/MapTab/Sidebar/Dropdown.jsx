import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Dropdown = ({ isOpen, setIsOpen, title, children }) => {
  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{title}</div>
        <button
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            display: 'block',
            cursor: 'pointer',
          }}
        >
          <KeyboardArrowDownIcon
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'all 0.3s',
            }}
          />
        </button>
      </div>
      <hr />
      <div
        style={{
          height: isOpen ? 'fit-content' : '0',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Dropdown;
