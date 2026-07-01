import React from 'react';

export function NxButton({ label = 'Nx Button' }) {
  return (
     <button style={{ padding: '10px 20px', backgroundColor: '#0052CC', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
      {label} - updated1
    </button>
  );
}
