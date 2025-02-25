'use client';

import React from 'react';

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-2 ${className}`}>
    {children}
  </div>
);