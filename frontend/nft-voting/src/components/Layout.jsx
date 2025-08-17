// src/components/Layout.jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="app-neo">
      <div className="container-neo">
        {children}
      </div>
    </div>
  );
}
