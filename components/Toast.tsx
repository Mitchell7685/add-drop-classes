'use client';
import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' 
        ? 'bg-[#689d6a] text-[#282828]' 
        : 'bg-[#fb4934] text-[#ebdbb2]'
    }`}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}
