'use client';

import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`shadow-md p-4 rounded-md ${className}`}>
    {children}
  </div>
);
