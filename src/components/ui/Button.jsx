'use client';

import React from 'react';

export const Button = ({ variant = 'default', className = '', children, ...props }) => {
  return (
    <button
      className={`p-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
